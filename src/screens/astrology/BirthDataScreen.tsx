import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/types/navigation';
import { searchCities, type City } from '@/data/cities';
import { useBirthData } from '@/hooks/useBirthData';

type Props = NativeStackScreenProps<MainStackParamList, 'BirthData'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date();
TODAY.setHours(23, 59, 59, 999);
const MIN_DATE = new Date(1900, 0, 1);
const DEFAULT_DATE = new Date(1990, 0, 1);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeString(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function validateDate(d: Date | null): string {
  if (!d) return 'Birth date is required';
  if (d > TODAY) return 'Birth date cannot be in the future';
  if (d < MIN_DATE) return 'Birth date cannot be before 1900';
  return '';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({
  label,
  badge,
}: {
  label: string;
  badge: 'required' | 'optional';
}) {
  return (
    <View className="flex-row items-center gap-2 mb-2">
      <Text className="text-cosmic-muted text-sm font-medium">{label}</Text>
      {badge === 'required' ? (
        <View className="bg-cosmic-primary/20 rounded-full px-2 py-0.5">
          <Text className="text-cosmic-primary text-[10px] font-bold tracking-wide">
            REQUIRED
          </Text>
        </View>
      ) : (
        <View className="bg-white/10 rounded-full px-2 py-0.5">
          <Text className="text-cosmic-muted text-[10px] tracking-wide">
            OPTIONAL
          </Text>
        </View>
      )}
    </View>
  );
}

function PickerRow({
  icon,
  value,
  placeholder,
  hasError,
  onPress,
  onClear,
}: {
  icon: string;
  value?: string;
  placeholder: string;
  hasError?: boolean;
  onPress: () => void;
  onClear?: () => void;
}) {
  return (
    <View
      className={`flex-row items-center bg-cosmic-surface rounded-xl border px-4 py-[14px] ${
        hasError ? 'border-cosmic-error-border' : 'border-cosmic-primary/40'
      }`}
    >
      <TouchableOpacity
        className="flex-1 flex-row items-center"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className="text-[18px] mr-3">{icon}</Text>
        <Text
          className={`flex-1 text-base ${
            value ? 'text-cosmic-text' : 'text-cosmic-muted'
          }`}
        >
          {value ?? placeholder}
        </Text>
      </TouchableOpacity>
      {value && onClear ? (
        <TouchableOpacity
          onPress={onClear}
          className="ml-2 p-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-cosmic-muted text-xl leading-none">×</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text className="text-cosmic-muted text-lg">›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function PickerModal({
  visible,
  title,
  onCancel,
  onDone,
  children,
}: {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onDone: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-cosmic-surface rounded-t-3xl pb-8">
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-cosmic-muted/40" />
          </View>
          <View className="flex-row justify-between items-center px-5 py-3">
            <TouchableOpacity onPress={onCancel} className="p-1">
              <Text className="text-cosmic-muted text-base">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-cosmic-text text-base font-semibold">
              {title}
            </Text>
            <TouchableOpacity onPress={onDone} className="p-1">
              <Text className="text-cosmic-primary text-base font-semibold">
                Done
              </Text>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BirthDataScreen({ navigation, route }: Props) {
  const isEdit = route.params?.isEdit ?? false;
  const { birthData, saving, error: saveError, saveBirthData, updateBirthData } =
    useBirthData();

  // ── Date state ──────────────────────────────────────────────────────────────
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date>(DEFAULT_DATE);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTouched, setDateTouched] = useState(false);

  // ── Time state (hours + minutes to avoid Date/timezone issues) ──────────────
  const [birthHour, setBirthHour] = useState<number | null>(null);
  const [birthMinute, setBirthMinute] = useState<number | null>(null);
  const [tempHour, setTempHour] = useState(12);
  const [tempMinute, setTempMinute] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  // iOS spinner fires onChange on mount with device time — skip the first call
  const pickerInitRef = useRef(false);

  // ── Location state ──────────────────────────────────────────────────────────
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [suggestions, setSuggestions] = useState<City[]>([]);

  // ── Pre-fill form in edit mode (runs once when birthData loads) ─────────────
  const prefilledRef = useRef(false);

  useEffect(() => {
    if (!isEdit || !birthData || prefilledRef.current) return;
    prefilledRef.current = true;

    // Date
    setBirthDate(new Date(birthData.birthDate));
    setDateTouched(true);

    // Time
    if (birthData.birthTime) {
      const [h, m] = birthData.birthTime.split(':').map(Number);
      setBirthHour(h);
      setBirthMinute(m);
    }

    // Location — reconstruct City object from stored strings + coords
    if (birthData.location && birthData.lat != null && birthData.lon != null) {
      const commaIdx = birthData.location.indexOf(', ');
      const city = commaIdx > -1 ? birthData.location.slice(0, commaIdx) : birthData.location;
      const country = commaIdx > -1 ? birthData.location.slice(commaIdx + 2) : '';
      setSelectedCity({ city, country, lat: birthData.lat, lon: birthData.lon });
      setLocationQuery(birthData.location);
    }
  }, [isEdit, birthData]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const dateError = validateDate(birthDate);
  const isFormValid = dateError === '';
  const birthTimeDisplay = birthHour !== null
    ? timeString(birthHour, birthMinute ?? 0)
    : undefined;

  // ── Date handlers ─────────────────────────────────────────────────────────
  const openDatePicker = () => {
    setTempDate(birthDate ?? DEFAULT_DATE);
    setShowDatePicker(true);
  };

  const handleDateChange = (_: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (picked) { setBirthDate(picked); setDateTouched(true); }
    } else {
      if (picked) setTempDate(picked);
    }
  };

  const confirmDate = () => {
    setBirthDate(tempDate);
    setDateTouched(true);
    setShowDatePicker(false);
  };

  // ── Time handlers ─────────────────────────────────────────────────────────
  const openTimePicker = () => {
    setTempHour(birthHour ?? 12);
    setTempMinute(birthMinute ?? 0);
    pickerInitRef.current = true; // next onChange is the iOS mount fire — ignore it
    setShowTimePicker(true);
  };

  const handleTimeChange = (_: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (picked) {
        setBirthHour(picked.getHours());
        setBirthMinute(picked.getMinutes());
      }
    } else {
      if (pickerInitRef.current) {
        pickerInitRef.current = false;
        return; // ignore the mount-time onChange — it carries device time, not our value
      }
      if (picked) {
        setTempHour(picked.getHours());
        setTempMinute(picked.getMinutes());
      }
    }
  };

  const confirmTime = () => {
    setBirthHour(tempHour);
    setBirthMinute(tempMinute);
    setShowTimePicker(false);
  };

  // ── Location handlers ──────────────────────────────────────────────────────
  const handleLocationChange = (text: string) => {
    setLocationQuery(text);
    setSelectedCity(null);
    setSuggestions(searchCities(text));
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setLocationQuery(`${city.city}, ${city.country}`);
    setSuggestions([]);
  };

  const clearLocation = () => {
    setLocationQuery('');
    setSelectedCity(null);
    setSuggestions([]);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setDateTouched(true);
    if (!isFormValid) return;

    const payload = {
      birthDate: birthDate!.toISOString(),
      birthTime: birthHour !== null ? timeString(birthHour, birthMinute ?? 0) : null,
      location: selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : null,
      lat: selectedCity?.lat ?? null,
      lon: selectedCity?.lon ?? null,
    };

    const ok = isEdit
      ? await updateBirthData(payload)
      : await saveBirthData(payload);

    if (!ok) return; // error is set in hook; stay on screen

    // replace() removes BirthDataScreen from the stack so Back goes to Home
    navigation.replace('HoroscopeResult', {
      birthDate: payload.birthDate,
      birthTime: payload.birthTime ?? undefined,
      location: payload.location ?? undefined,
      lat: payload.lat ?? undefined,
      lon: payload.lon ?? undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cosmic-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="px-6 py-8 gap-1"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ── Header ── */}
        <View className="items-center mb-8">
          <Text className="text-[48px] mb-3">{isEdit ? '✏️' : '🌟'}</Text>
          <Text className="text-cosmic-text text-2xl font-bold text-center">
            {isEdit ? 'Edit Birth Details' : 'Your Birth Chart'}
          </Text>
          <Text className="text-cosmic-muted text-sm text-center mt-2 leading-relaxed">
            {isEdit
              ? 'Update your details below'
              : 'Enter your birth details to generate\nyour personalised cosmic map'}
          </Text>
        </View>

        {/* ── Firebase save error ── */}
        {saveError ? (
          <View className="bg-cosmic-error-bg rounded-[10px] p-3 mb-4 border border-cosmic-error-border">
            <Text className="text-cosmic-error-text text-sm text-center">
              {saveError}
            </Text>
          </View>
        ) : null}

        {/* ── Birth Date ── */}
        <View className="mb-6">
          <SectionLabel label="Birth Date" badge="required" />
          <PickerRow
            icon="📅"
            value={birthDate ? formatDate(birthDate) : undefined}
            placeholder="Select your birth date"
            hasError={dateTouched && !!dateError}
            onPress={openDatePicker}
          />
          {dateTouched && dateError ? (
            <Text className="text-cosmic-field-error text-xs mt-1.5 ml-1">
              {dateError}
            </Text>
          ) : null}
        </View>

        {/* ── Birth Time ── */}
        <View className="mb-6">
          <SectionLabel label="Birth Time" badge="optional" />
          <PickerRow
            icon="🕐"
            value={birthTimeDisplay}
            placeholder="Add birth time (24-hour)"
            onPress={openTimePicker}
            onClear={birthHour !== null
              ? () => { setBirthHour(null); setBirthMinute(null); }
              : undefined}
          />
          <Text className="text-cosmic-muted/60 text-xs mt-1.5 ml-1">
            More accurate chart with an exact time
          </Text>
        </View>

        {/* ── Location ── */}
        <View className="mb-8">
          <SectionLabel label="Birth Location" badge="optional" />
          <View className="flex-row items-center bg-cosmic-surface rounded-xl border border-cosmic-primary/40 px-4 py-[14px]">
            <Text className="text-[18px] mr-3">📍</Text>
            <TextInput
              className="flex-1 text-cosmic-text text-base"
              value={locationQuery}
              onChangeText={handleLocationChange}
              placeholder="Search city…"
              placeholderTextColor="#8e6aaa"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {locationQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearLocation}
                className="ml-2 p-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-cosmic-muted text-xl leading-none">×</Text>
              </TouchableOpacity>
            )}
          </View>

          {suggestions.length > 0 && (
            <View className="bg-cosmic-surface rounded-xl border border-cosmic-primary/40 mt-1 overflow-hidden">
              {suggestions.map((city, index) => (
                <TouchableOpacity
                  key={`${city.city}-${city.country}`}
                  onPress={() => handleCitySelect(city)}
                  className={`flex-row items-center px-4 py-3 ${
                    index < suggestions.length - 1
                      ? 'border-b border-cosmic-primary/20'
                      : ''
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className="text-base mr-2">🏙️</Text>
                  <View className="flex-1">
                    <Text className="text-cosmic-text text-sm font-medium">
                      {city.city}
                    </Text>
                    <Text className="text-cosmic-muted text-xs mt-0.5">
                      {city.country}
                    </Text>
                  </View>
                  <Text className="text-cosmic-muted text-xs">
                    {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedCity && (
            <Text className="text-cosmic-muted/60 text-xs mt-1.5 ml-1">
              {selectedCity.lat.toFixed(4)}°N, {selectedCity.lon.toFixed(4)}°E
            </Text>
          )}
        </View>

        {/* ── Action button ── */}
        <TouchableOpacity
          testID="submit-button"
          className={`rounded-[14px] py-4 items-center bg-cosmic-primary${
            !isFormValid || saving ? ' opacity-45' : ''
          }`}
          onPress={handleSubmit}
          disabled={!isFormValid || saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#e8d5f5" />
          ) : (
            <Text className="text-cosmic-text text-base font-bold tracking-wide">
              {isEdit ? 'Update Birth Details ✨' : 'Generate My Chart ✨'}
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-cosmic-muted/60 text-xs text-center mt-3">
          You can always update this later
        </Text>
      </ScrollView>

      {/* ── iOS pickers ── */}
      {Platform.OS === 'ios' && (
        <PickerModal
          visible={showDatePicker}
          title="Birth Date"
          onCancel={() => setShowDatePicker(false)}
          onDone={confirmDate}
        >
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={TODAY}
            minimumDate={MIN_DATE}
            textColor="#e8d5f5"
          />
        </PickerModal>
      )}

      {Platform.OS === 'ios' && (
        <PickerModal
          visible={showTimePicker}
          title="Birth Time"
          onCancel={() => setShowTimePicker(false)}
          onDone={confirmTime}
        >
          <DateTimePicker
            value={new Date(2000, 0, 1, tempHour, tempMinute, 0)}
            mode="time"
            display="spinner"
            is24Hour
            onChange={handleTimeChange}
            textColor="#e8d5f5"
          />
        </PickerModal>
      )}

      {/* ── Android pickers ── */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          onChange={handleDateChange}
          maximumDate={TODAY}
          minimumDate={MIN_DATE}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={new Date(2000, 0, 1, birthHour ?? 12, birthMinute ?? 0, 0)}
          mode="time"
          is24Hour
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}
