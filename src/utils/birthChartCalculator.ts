/**
 * Birth Chart Calculator
 *
 * Accuracy by planet:
 *   Sun    ±0.1°  — very high (true solar longitude formula)
 *   Moon   ±1–2°  — good (16-term truncated series; may be off one sign at cusps)
 *   Rising ±5°    — moderate with exact birth time; unknown without it
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ZodiacName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export type MoonPhaseName =
  | 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous'
  | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';

export interface ZodiacSignData {
  name: ZodiacName;
  symbol: string;
  emoji: string;
  element: Element;
  modality: Modality;
  rulingPlanet: string;
  keywords: string[];
  description: string;
}

export interface ChartPosition {
  sign: ZodiacName;
  /** Degrees within the sign, 0–29.99 */
  degree: number;
  /** Full ecliptic longitude, 0–359.99 */
  longitude: number;
  /** 1 (rough estimate) → 5 (high accuracy) */
  accuracyRating: 1 | 2 | 3 | 4 | 5;
  warning?: string;
}

export interface MoonPosition extends ChartPosition {
  phase: MoonPhaseName;
  /** 0° = New Moon, 180° = Full Moon */
  phaseAngle: number;
  /** 0–100 % */
  illumination: number;
}

export interface RisingPosition extends ChartPosition {
  requiresTime: boolean;
}

export interface BirthChart {
  sun: ChartPosition;
  moon: MoonPosition;
  rising: RisingPosition;
  generatedAt: string;
  hasTime: boolean;
  hasLocation: boolean;
  overallAccuracy: 1 | 2 | 3 | 4 | 5;
}

export interface SignInterpretation {
  sunMeaning: string;
  moonMeaning: string;
  risingMeaning: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  compatibleSigns: ZodiacName[];
}

// ─── Zodiac sign catalogue ────────────────────────────────────────────────────

const ZODIAC_NAMES: ZodiacName[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_SIGNS: ZodiacSignData[] = [
  {
    name: 'Aries',
    symbol: '♈', emoji: '🐏',
    element: 'Fire', modality: 'Cardinal', rulingPlanet: 'Mars',
    keywords: ['bold', 'pioneering', 'courageous', 'impulsive', 'direct'],
    description: 'The trailblazer of the zodiac — bold, energetic, and always first.',
  },
  {
    name: 'Taurus',
    symbol: '♉', emoji: '🐂',
    element: 'Earth', modality: 'Fixed', rulingPlanet: 'Venus',
    keywords: ['patient', 'reliable', 'sensual', 'stubborn', 'loyal'],
    description: 'Grounded and steadfast — values comfort, beauty, and lasting security.',
  },
  {
    name: 'Gemini',
    symbol: '♊', emoji: '👯',
    element: 'Air', modality: 'Mutable', rulingPlanet: 'Mercury',
    keywords: ['curious', 'witty', 'adaptable', 'restless', 'communicative'],
    description: 'The eternal student — quick-minded, versatile, and always hungry for ideas.',
  },
  {
    name: 'Cancer',
    symbol: '♋', emoji: '🦀',
    element: 'Water', modality: 'Cardinal', rulingPlanet: 'Moon',
    keywords: ['nurturing', 'intuitive', 'protective', 'emotional', 'empathic'],
    description: 'The cosmic caregiver — fiercely protective and deeply attuned to emotion.',
  },
  {
    name: 'Leo',
    symbol: '♌', emoji: '🦁',
    element: 'Fire', modality: 'Fixed', rulingPlanet: 'Sun',
    keywords: ['charismatic', 'generous', 'proud', 'dramatic', 'loyal'],
    description: 'The natural ruler — magnetic, warm-hearted, and born to shine.',
  },
  {
    name: 'Virgo',
    symbol: '♍', emoji: '🌾',
    element: 'Earth', modality: 'Mutable', rulingPlanet: 'Mercury',
    keywords: ['analytical', 'diligent', 'modest', 'perfectionist', 'helpful'],
    description: 'The master craftsperson — precise, practical, and quietly indispensable.',
  },
  {
    name: 'Libra',
    symbol: '♎', emoji: '⚖️',
    element: 'Air', modality: 'Cardinal', rulingPlanet: 'Venus',
    keywords: ['diplomatic', 'charming', 'fair-minded', 'indecisive', 'elegant'],
    description: 'The seeker of balance — graceful, just, and deeply invested in harmony.',
  },
  {
    name: 'Scorpio',
    symbol: '♏', emoji: '🦂',
    element: 'Water', modality: 'Fixed', rulingPlanet: 'Pluto',
    keywords: ['intense', 'perceptive', 'secretive', 'passionate', 'transformative'],
    description: 'The alchemist of the zodiac — probing the depths to emerge transformed.',
  },
  {
    name: 'Sagittarius',
    symbol: '♐', emoji: '🏹',
    element: 'Fire', modality: 'Mutable', rulingPlanet: 'Jupiter',
    keywords: ['adventurous', 'optimistic', 'philosophical', 'restless', 'honest'],
    description: 'The cosmic explorer — relentlessly seeking truth, wisdom, and the next horizon.',
  },
  {
    name: 'Capricorn',
    symbol: '♑', emoji: '🐐',
    element: 'Earth', modality: 'Cardinal', rulingPlanet: 'Saturn',
    keywords: ['ambitious', 'disciplined', 'strategic', 'reserved', 'dependable'],
    description: 'The steadfast climber — patient, determined, and built for long-term success.',
  },
  {
    name: 'Aquarius',
    symbol: '♒', emoji: '🏺',
    element: 'Air', modality: 'Fixed', rulingPlanet: 'Uranus',
    keywords: ['innovative', 'humanitarian', 'independent', 'eccentric', 'visionary'],
    description: 'The visionary rebel — years ahead of their time, wired for collective change.',
  },
  {
    name: 'Pisces',
    symbol: '♓', emoji: '🐟',
    element: 'Water', modality: 'Mutable', rulingPlanet: 'Neptune',
    keywords: ['empathic', 'dreamy', 'artistic', 'intuitive', 'self-sacrificing'],
    description: 'The mystic of the zodiac — boundlessly empathetic and attuned to the unseen.',
  },
];

// ─── Interpretations ──────────────────────────────────────────────────────────

export const SIGN_INTERPRETATIONS: Record<ZodiacName, SignInterpretation> = {
  Aries: {
    sunMeaning: 'Bold and pioneering, you charge ahead where others hesitate. Fueled by passion and a need to be first, you lead through courage rather than patience. Your directness is your superpower — and sometimes your blind spot.',
    moonMeaning: 'Your emotional responses are immediate and intense, but rarely linger. You need freedom and excitement to feel secure; smothering makes you restless. When threatened, you are fiercely protective of those you love.',
    risingMeaning: 'You project energy and directness that others find either exciting or intimidating. First impression: bold, refreshingly honest, someone who takes initiative without waiting for permission.',
    traits: ['Courageous', 'Enthusiastic', 'Competitive', 'Impulsive', 'Direct'],
    strengths: ['Natural leadership', 'Initiative', 'Raw courage', 'Infectious enthusiasm'],
    challenges: ['Impatience', 'Impulsive decisions', 'Short temper', 'Starting more than finishing'],
    compatibleSigns: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
  },
  Taurus: {
    sunMeaning: 'You build your life with care, surrounding yourself with beauty, comfort, and things that last. Deeply loyal and slow to trust, you reward patience with unwavering devotion. Change is the one thing you resist, even when it serves you.',
    moonMeaning: 'You need physical comfort and stability to feel truly safe. Slow to trust, but once given, your loyalty is absolute. Possessiveness is your shadow side — love shouldn\'t mean ownership.',
    risingMeaning: 'You project calm, unhurried reliability. Others find you reassuring — the kind of person who seems solid even when the ground shifts. First impression: warm, composed, and quietly sensual.',
    traits: ['Patient', 'Reliable', 'Sensual', 'Stubborn', 'Practical'],
    strengths: ['Dependability', 'Long-term thinking', 'Aesthetic eye', 'Quiet determination'],
    challenges: ['Resistance to change', 'Possessiveness', 'Materialism', 'Inflexibility'],
    compatibleSigns: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
  },
  Gemini: {
    sunMeaning: 'Your mind moves faster than most can follow — collecting ideas, making unexpected connections, and playing devil\'s advocate for sport. You need variety and conversation to feel alive. Depth comes when you choose to stay in one place long enough.',
    moonMeaning: 'You process feelings through words and ideas rather than sitting in them. Emotionally, you need mental stimulation and freedom; monotony drains you. Others may read your lightness as detachment, but you care deeply — in your own mercurial way.',
    risingMeaning: 'You project wit, curiosity, and easy sociability. Others see someone who can talk to anyone and make it feel effortless. First impression: lively, clever, and genuinely interested in what you have to say.',
    traits: ['Curious', 'Adaptable', 'Witty', 'Restless', 'Expressive'],
    strengths: ['Communication', 'Versatility', 'Quick thinking', 'Social intelligence'],
    challenges: ['Inconsistency', 'Superficiality', 'Indecision', 'Scattered energy'],
    compatibleSigns: ['Libra', 'Aquarius', 'Aries', 'Leo'],
  },
  Cancer: {
    sunMeaning: 'Home is your cosmos. You feel the emotions of those around you as if they were your own, and you protect what you love with fierce, invisible armor. Your sensitivity is your greatest gift; learning to protect it without shutting others out is your life\'s work.',
    moonMeaning: 'The Moon is your ruler, so this is your most natural placement — deeply intuitive, nurturing, and attuned to subtle energies. Your home is your sanctuary. Moods ebb and flow; you need safe harbor to recharge before giving again.',
    risingMeaning: 'You project warmth and approachability; strangers sense that you won\'t judge them. Others often open up to you before they realize they\'re doing it. First impression: caring, receptive, and deeply human.',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Moody', 'Loyal'],
    strengths: ['Emotional intelligence', 'Fierce loyalty', 'Intuition', 'Creating belonging'],
    challenges: ['Mood swings', 'Clinging to the past', 'Oversensitivity', 'Indirect communication'],
    compatibleSigns: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
  },
  Leo: {
    sunMeaning: 'You were born to shine — generously, dramatically, and with your whole heart. At your best, your warmth lifts everyone in the room. The shadow side is needing to be the sun in every orbit; your light is brightest when it illuminates others too.',
    moonMeaning: 'You need to feel seen, appreciated, and genuinely loved to feel emotionally secure. You give affection lavishly and need it returned in kind. Pride can make vulnerability feel dangerous — but it\'s where your deepest connections live.',
    risingMeaning: 'You enter a room and people notice — not because you demand it, but because your presence has gravity. Others see someone confident, theatrical, and genuinely warm. First impression: someone worth watching.',
    traits: ['Charismatic', 'Generous', 'Dramatic', 'Proud', 'Loyal'],
    strengths: ['Natural magnetism', 'Big-heartedness', 'Creative vision', 'Inspiring others'],
    challenges: ['Ego fragility', 'Attention-seeking', 'Domineering', 'Vanity'],
    compatibleSigns: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
  },
  Virgo: {
    sunMeaning: 'You see what everyone else overlooks — the detail, the flaw, the elegant fix. Your work ethic is formidable, and you show love through service and practical help. Perfectionism is your engine and your cage; learning that \'done\' can be better than \'perfect\' unlocks everything.',
    moonMeaning: 'You process emotions analytically — feeling first, then immediately trying to understand. You show care through helpful acts, not grand declarations. The inner critic runs loud; learning self-compassion is lifelong work.',
    risingMeaning: 'You project quiet competence and attentiveness. Others sense that you notice things and can be relied on to do them right. First impression: thoughtful, understated, and distinctly capable.',
    traits: ['Analytical', 'Diligent', 'Modest', 'Critical', 'Helpful'],
    strengths: ['Attention to detail', 'Reliability', 'Practical problem-solving', 'Integrity'],
    challenges: ['Perfectionism', 'Over-criticism of self and others', 'Anxiety', 'Over-analysis'],
    compatibleSigns: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
  },
  Libra: {
    sunMeaning: 'You are the diplomat of the zodiac — attuned to beauty, fairness, and the dynamics between people. You see all sides of every argument, which makes you wise and sometimes paralyzed. Your superpower is creating harmony where conflict once lived.',
    moonMeaning: 'You need partnership and balance to feel emotionally secure. Conflict is deeply unsettling; you\'ll go to great lengths to smooth it over, sometimes at the cost of your own needs. Harmony is your natural state — but you still deserve to be honest about what you want.',
    risingMeaning: 'You project charm, elegance, and social ease. Others find you approachable, fair-minded, and pleasing to be around. First impression: graceful, balanced, and someone who makes you feel at ease immediately.',
    traits: ['Diplomatic', 'Charming', 'Fair-minded', 'Indecisive', 'Elegant'],
    strengths: ['Diplomacy', 'Sense of fairness', 'Aesthetic intelligence', 'Partnership'],
    challenges: ['Indecisiveness', 'People-pleasing', 'Avoiding conflict', 'Dependency'],
    compatibleSigns: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
  },
  Scorpio: {
    sunMeaning: 'You experience life at a depth others rarely reach. Power, transformation, and truth are your obsessions — and you can see through pretense like a clean window. Trust takes time to earn, but once given, your loyalty is absolute and unbreakable.',
    moonMeaning: 'Your emotional life is intense, private, and transformative. You never forget a wound or a kindness. Vulnerability feels like danger, but your emotional power grows when you allow yourself to be known. Healing and depth are your birthright.',
    risingMeaning: 'You project intensity and quiet magnetism. People are drawn to you without knowing why, sensing hidden depths. First impression: penetrating, mysterious, someone who sees more than they say.',
    traits: ['Intense', 'Perceptive', 'Determined', 'Secretive', 'Transformative'],
    strengths: ['Psychological depth', 'Resilience', 'Loyalty', 'Investigative mind'],
    challenges: ['Jealousy', 'Control issues', 'Holding grudges', 'All-or-nothing thinking'],
    compatibleSigns: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
  },
  Sagittarius: {
    sunMeaning: 'Freedom is your highest value — freedom of movement, thought, and belief. You are the seeker: always chasing the next horizon, the bigger truth, the wilder adventure. Your optimism is contagious and your honesty can be blunt. The world is your classroom.',
    moonMeaning: 'You need freedom and adventure to feel emotionally alive. Routine and restriction feel like slow suffocation. Even in pain, your natural optimism finds a philosophy to hold onto. Long conversations about meaning soothe you better than comfort alone.',
    risingMeaning: 'You project enthusiasm, openness, and a sense that life is fundamentally worthwhile. Others see an adventurous spirit who makes even mundane things feel like the beginning of an epic. First impression: warm, expansive, and gloriously unfiltered.',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Restless', 'Blunt'],
    strengths: ['Optimism', 'Big-picture thinking', 'Enthusiasm', 'Wisdom-seeking'],
    challenges: ['Overcommitting', 'Tactlessness', 'Restlessness', 'Avoiding depth'],
    compatibleSigns: ['Aries', 'Leo', 'Libra', 'Aquarius'],
  },
  Capricorn: {
    sunMeaning: 'You play a long game, and you usually win. Disciplined, strategic, and deeply ambitious, you build structures that last. You carry responsibility like armor — sometimes forgetting that softness and rest are also forms of strength.',
    moonMeaning: 'You keep your emotional life tightly controlled — showing love through responsibility, reliability, and provision rather than words. Feelings run deep and private. Your challenge is learning that emotional needs aren\'t weaknesses to be managed.',
    risingMeaning: 'You project authority and quiet self-possession. Others sense someone who has their life together and doesn\'t need approval to keep moving. First impression: serious, capable, and somehow older than their years.',
    traits: ['Ambitious', 'Disciplined', 'Strategic', 'Reserved', 'Dependable'],
    strengths: ['Long-term thinking', 'Work ethic', 'Resilience', 'Practical wisdom'],
    challenges: ['Emotional unavailability', 'Workaholism', 'Pessimism', 'Rigidity'],
    compatibleSigns: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
  },
  Aquarius: {
    sunMeaning: 'You live in the future. Humanitarian, original, and fiercely independent, you are drawn to ideas and systems that could make the world better. Belonging matters to you more than you let on — the trick is letting people in while staying true to your singular vision.',
    moonMeaning: 'You experience emotions at arm\'s length — processing them intellectually before fully feeling them. You need friendship and shared ideals more than traditional romance. Emotional security comes from feeling free to be exactly who you are.',
    risingMeaning: 'You project originality and a certain untouchable cool. Others see someone who doesn\'t need to fit in and somehow makes that look like the best possible option. First impression: distinctive, forward-thinking, and quietly electric.',
    traits: ['Innovative', 'Independent', 'Humanitarian', 'Eccentric', 'Visionary'],
    strengths: ['Original thinking', 'Objectivity', 'Idealism', 'Community building'],
    challenges: ['Emotional detachment', 'Stubbornness about ideas', 'Contrariness', 'Aloofness'],
    compatibleSigns: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
  },
  Pisces: {
    sunMeaning: 'You move between worlds — the visible and invisible, the real and imagined — with equal comfort. Your empathy has no off switch, which is both your gift and your wound. Creativity, compassion, and spiritual depth are your native languages.',
    moonMeaning: 'You absorb the emotions of everyone around you like a sponge, which means you need solitude to know what you actually feel. Artistic expression, water, and quiet heal you. You love without conditions — learn to apply that same grace to yourself.',
    risingMeaning: 'You project a gentle, dreamy quality that makes others want to protect you and confide in you simultaneously. There\'s something otherworldly in your manner — soft, permeable, and deeply kind. First impression: warm, artistic, and somehow familiar.',
    traits: ['Empathic', 'Dreamy', 'Artistic', 'Intuitive', 'Compassionate'],
    strengths: ['Empathy', 'Imagination', 'Spiritual depth', 'Artistic ability'],
    challenges: ['Escapism', 'Poor boundaries', 'Victim mentality', 'Indecisiveness'],
    compatibleSigns: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
  },
};

// ─── Low-level astronomical utilities ─────────────────────────────────────────

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Wraps any angle to [0, 360) */
function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Julian Day Number for a given UTC date/time.
 * Accurate for dates from 1900–2100.
 */
function julianDay(utcDate: Date): number {
  let Y = utcDate.getUTCFullYear();
  let M = utcDate.getUTCMonth() + 1;
  const D = utcDate.getUTCDate();
  const H = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600;

  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregorian correction

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + H / 24 + B - 1524.5;
}

/**
 * Constructs a UTC Date from ISO birth date + optional HH:MM local time.
 * Birth time is assumed to be local solar time; converted to UT via longitude.
 */
function buildUtcDate(birthDate: string, birthTime?: string, longitude?: number): Date {
  const base = new Date(birthDate);
  const Y = base.getUTCFullYear();
  const Mo = base.getUTCMonth();
  const D = base.getUTCDate();

  let utHour = 12; // default: solar noon UT
  if (birthTime) {
    const [h, m] = birthTime.split(':').map(Number);
    const localHour = h + m / 60;
    // Local Mean Time offset: longitude/15 hours east of Greenwich
    const tzOffset = (longitude ?? 0) / 15;
    utHour = localHour - tzOffset;
    // clamp to valid 24h range (cross-midnight edge case)
    utHour = ((utHour % 24) + 24) % 24;
  }

  const ms = Date.UTC(Y, Mo, D) + utHour * 3_600_000;
  return new Date(ms);
}

// ─── Core planetary calculations ──────────────────────────────────────────────

/**
 * Sun's apparent ecliptic longitude (degrees).
 * Formula: Meeus, Astronomical Algorithms Ch. 25 (low-accuracy, ±0.01°).
 */
function calcSunLongitude(jd: number): number {
  const d = jd - 2_451_545.0;       // days since J2000.0
  const T = d / 36_525;              // Julian centuries

  const L0 = normalizeAngle(280.46646 + 36_000.76983 * T);
  const M  = normalizeAngle(357.52911 + 35_999.05029 * T);
  const Mrad = toRadians(M);

  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);

  const theta = L0 + C;                               // true longitude
  const omega = 125.04 - 0.052954 * d;                // ascending node
  const lambda = theta - 0.00569 - 0.00478 * Math.sin(toRadians(omega));

  return normalizeAngle(lambda);
}

/**
 * Moon's apparent ecliptic longitude (degrees).
 * 16-term truncated series from Meeus Ch. 47, accurate to ±0.5°.
 */
function calcMoonLongitude(jd: number): number {
  const d = jd - 2_451_545.0;
  const T = d / 36_525;

  const L  = normalizeAngle(218.3164477 + 481_267.88123421 * T);  // mean longitude
  const D  = normalizeAngle(297.8501921 + 445_267.1114034  * T);  // mean elongation
  const M  = normalizeAngle(357.5291092 +  35_999.0502909  * T);  // Sun's mean anomaly
  const M_ = normalizeAngle(134.9633964 + 477_198.8675055  * T);  // Moon's mean anomaly
  const F  = normalizeAngle( 93.2720950 + 483_202.0175233  * T);  // argument of latitude

  const sigmaL =
      6.288774 * Math.sin(toRadians(M_))
    + 1.274027 * Math.sin(toRadians(2 * D - M_))
    + 0.658314 * Math.sin(toRadians(2 * D))
    + 0.213618 * Math.sin(toRadians(2 * M_))
    - 0.185116 * Math.sin(toRadians(M))
    - 0.114332 * Math.sin(toRadians(2 * F))
    + 0.058793 * Math.sin(toRadians(2 * D - 2 * M_))
    + 0.057066 * Math.sin(toRadians(2 * D - M + M_))
    + 0.053322 * Math.sin(toRadians(2 * D + M_))
    + 0.045758 * Math.sin(toRadians(2 * D - M))
    - 0.040923 * Math.sin(toRadians(M - M_))
    - 0.034720 * Math.sin(toRadians(D))
    - 0.030383 * Math.sin(toRadians(M + M_))
    + 0.015327 * Math.sin(toRadians(2 * D - 2 * F))
    - 0.012528 * Math.sin(toRadians(M_ + 2 * F))
    + 0.010980 * Math.sin(toRadians(M_ - 2 * F));

  return normalizeAngle(L + sigmaL);
}

/**
 * Ascendant (Rising sign) ecliptic longitude (degrees).
 * Formula from Meeus Ch. 14. Accurate to ±0.5° given exact UT and coordinates.
 *
 * @param jd Julian Day (UT)
 * @param lat Geographic latitude, degrees N
 * @param lon Geographic longitude, degrees E
 */
function calcAscendant(jd: number, lat: number, lon: number): number {
  const d = jd - 2_451_545.0;
  const T = d / 36_525;

  // Greenwich Mean Sidereal Time (degrees)
  const GMST = normalizeAngle(
    280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38_710_000,
  );
  const LMST = normalizeAngle(GMST + lon);   // Local Mean Sidereal Time

  const eps = toRadians(23.4392911 - 0.013004167 * T);   // obliquity
  const ramcRad = toRadians(LMST);
  const latRad  = toRadians(lat);

  const asc = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.sin(eps) + Math.tan(latRad) * Math.cos(eps)),
  );

  return normalizeAngle(toDegrees(asc));
}

// ─── Helpers derived from longitude ───────────────────────────────────────────

function signFromLongitude(longitude: number): ZodiacName {
  return ZODIAC_NAMES[Math.floor(normalizeAngle(longitude) / 30)];
}

function degreeInSign(longitude: number): number {
  return Math.round((normalizeAngle(longitude) % 30) * 100) / 100;
}

function moonPhaseFromAngle(angle: number): MoonPhaseName {
  if (angle < 22.5)  return 'New Moon';
  if (angle < 67.5)  return 'Waxing Crescent';
  if (angle < 112.5) return 'First Quarter';
  if (angle < 157.5) return 'Waxing Gibbous';
  if (angle < 202.5) return 'Full Moon';
  if (angle < 247.5) return 'Waning Gibbous';
  if (angle < 292.5) return 'Last Quarter';
  if (angle < 337.5) return 'Waning Crescent';
  return 'New Moon';
}

function illuminationFromAngle(phaseAngle: number): number {
  return Math.round(((1 - Math.cos(toRadians(phaseAngle))) / 2) * 100);
}

// ─── Caching ──────────────────────────────────────────────────────────────────

const chartCache = new Map<string, BirthChart>();

function cacheKey(
  birthDate: string,
  birthTime?: string,
  lat?: number,
  lon?: number,
): string {
  return `${birthDate}|${birthTime ?? ''}|${lat ?? ''}|${lon ?? ''}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns the Sun sign name for a birth date. */
export function calculateSunSign(birthDate: string): ZodiacName {
  const jd = julianDay(buildUtcDate(birthDate));
  return signFromLongitude(calcSunLongitude(jd));
}

/** Returns Sun sign + degree within that sign. */
export function calculateSunSignWithDegree(
  birthDate: string,
  birthTime?: string,
): { sign: ZodiacName; degree: number; longitude: number } {
  const jd = julianDay(buildUtcDate(birthDate, birthTime));
  const lon = calcSunLongitude(jd);
  return {
    sign: signFromLongitude(lon),
    degree: degreeInSign(lon),
    longitude: Math.round(lon * 100) / 100,
  };
}

/** Returns Moon sign, degree, phase, and illumination. */
export function calculateMoonSign(
  birthDate: string,
  birthTime?: string,
  longitude?: number,
): MoonPosition {
  const utDate = buildUtcDate(birthDate, birthTime, longitude);
  const jd = julianDay(utDate);

  const moonLon = calcMoonLongitude(jd);
  const sunLon  = calcSunLongitude(jd);
  const phaseAngle = normalizeAngle(moonLon - sunLon);
  const degInSign  = degreeInSign(moonLon);

  const nearCusp = degInSign < 2 || degInSign > 28;
  const noTime   = !birthTime;

  let accuracyRating: 1 | 2 | 3 | 4 | 5 = 4;
  let warning: string | undefined;

  if (noTime && nearCusp) {
    accuracyRating = 2;
    warning = 'Moon is near a sign boundary. Add your birth time for an accurate reading.';
  } else if (noTime) {
    accuracyRating = 3;
    warning = 'Calculated using noon — add birth time for higher accuracy.';
  } else if (nearCusp) {
    accuracyRating = 3;
    warning = 'Moon is near a sign cusp — sign may vary by ±1.';
  }

  return {
    sign: signFromLongitude(moonLon),
    degree: degInSign,
    longitude: Math.round(moonLon * 100) / 100,
    phase: moonPhaseFromAngle(phaseAngle),
    phaseAngle: Math.round(phaseAngle * 100) / 100,
    illumination: illuminationFromAngle(phaseAngle),
    accuracyRating,
    warning,
  };
}

/** Returns the current moon phase name for a date. */
export function calculateMoonPhase(birthDate: string, birthTime?: string): MoonPhaseName {
  const jd = julianDay(buildUtcDate(birthDate, birthTime));
  const moonLon = calcMoonLongitude(jd);
  const sunLon  = calcSunLongitude(jd);
  return moonPhaseFromAngle(normalizeAngle(moonLon - sunLon));
}

/** Returns the Rising (Ascendant) sign with accuracy metadata. */
export function calculateRisingSign(
  birthDate: string,
  birthTime?: string,
  latitude?: number,
  longitude?: number,
): RisingPosition {
  if (!birthTime) {
    // Cannot compute Ascendant without birth time — return placeholder
    const jd = julianDay(buildUtcDate(birthDate));
    const sunLon = calcSunLongitude(jd);
    return {
      sign: signFromLongitude(sunLon), // fallback: same as sun sign
      degree: degreeInSign(sunLon),
      longitude: Math.round(sunLon * 100) / 100,
      accuracyRating: 1,
      requiresTime: true,
      warning: 'Rising sign requires an exact birth time. This is a placeholder only.',
    };
  }

  const lat = latitude ?? 0;
  const lon = longitude ?? 0;
  const utDate = buildUtcDate(birthDate, birthTime, lon);
  const jd = julianDay(utDate);
  const ascLon = calcAscendant(jd, lat, lon);
  const degInSign = degreeInSign(ascLon);
  const nearCusp = degInSign < 3 || degInSign > 27;
  const noLocation = latitude == null;

  let accuracyRating: 1 | 2 | 3 | 4 | 5 = 4;
  let warning: string | undefined;

  if (noLocation && nearCusp) {
    accuracyRating = 2;
    warning = 'Location unknown (defaulted to equator) and near a cusp. Sign may be inaccurate.';
  } else if (noLocation) {
    accuracyRating = 3;
    warning = 'Birth location unknown — defaulted to equator. Sign may differ at higher latitudes.';
  } else if (nearCusp) {
    accuracyRating = 3;
    warning = 'Rising is near a sign cusp — add precise birth time for certainty.';
  }

  return {
    sign: signFromLongitude(ascLon),
    degree: degInSign,
    longitude: Math.round(ascLon * 100) / 100,
    accuracyRating,
    requiresTime: false,
    warning,
  };
}

/** Calculates the complete birth chart and caches the result. */
export function calculateCompleteChart(
  birthDate: string,
  birthTime?: string,
  location?: { lat: number; lon: number; name: string },
): BirthChart {
  const key = cacheKey(birthDate, birthTime, location?.lat, location?.lon);
  const cached = chartCache.get(key);
  if (cached) return cached;

  const lat = location?.lat;
  const lon = location?.lon;

  const sun    = (() => {
    const jd = julianDay(buildUtcDate(birthDate, birthTime, lon));
    const sunLon = calcSunLongitude(jd);
    const deg = degreeInSign(sunLon);
    const nearCusp = deg < 1 || deg > 29;
    return {
      sign: signFromLongitude(sunLon),
      degree: deg,
      longitude: Math.round(sunLon * 100) / 100,
      accuracyRating: 5 as const,
      warning: nearCusp ? 'Sun is at a cusp — sign is accurate but degree is approximate.' : undefined,
    };
  })();

  const moon   = calculateMoonSign(birthDate, birthTime, lon);
  const rising = calculateRisingSign(birthDate, birthTime, lat, lon);

  const hasTime     = !!birthTime;
  const hasLocation = !!location;

  const ratings = [sun.accuracyRating, moon.accuracyRating, rising.accuracyRating];
  const overallAccuracy = Math.round(
    ratings.reduce((a, b) => a + b, 0) / ratings.length,
  ) as 1 | 2 | 3 | 4 | 5;

  const chart: BirthChart = {
    sun,
    moon,
    rising,
    generatedAt: new Date().toISOString(),
    hasTime,
    hasLocation,
    overallAccuracy,
  };

  chartCache.set(key, chart);
  return chart;
}

/** Clears the chart cache (e.g. when birth data changes). */
export function clearChartCache(): void {
  chartCache.clear();
}

// ─── Helper / query functions ──────────────────────────────────────────────────

/** Returns the full ZodiacSignData for a given sign name. */
export function getZodiacInfo(sign: ZodiacName): ZodiacSignData {
  return ZODIAC_SIGNS.find((s) => s.name === sign)!;
}

/** Returns the interpretation object for a given sign. */
export function getSignInterpretation(sign: ZodiacName): SignInterpretation {
  return SIGN_INTERPRETATIONS[sign];
}

/** Returns signs that share the same element. */
export function getElementSigns(element: Element): ZodiacName[] {
  return ZODIAC_SIGNS.filter((s) => s.element === element).map((s) => s.name);
}

/** Returns signs that share the same modality. */
export function getModalitySigns(modality: Modality): ZodiacName[] {
  return ZODIAC_SIGNS.filter((s) => s.modality === modality).map((s) => s.name);
}

/** Returns the traditional compatible signs for a given sun sign. */
export function getCompatibleSigns(sign: ZodiacName): ZodiacName[] {
  return SIGN_INTERPRETATIONS[sign].compatibleSigns;
}

/** Returns a short summary combining sun + moon + rising. */
export function getChartSummary(chart: BirthChart): string {
  const sunInfo  = getZodiacInfo(chart.sun.sign);
  const moonInfo = getZodiacInfo(chart.moon.sign);

  const parts = [
    `Your Sun in ${chart.sun.sign} (${sunInfo.element} ${sunInfo.modality}) shapes your core identity.`,
    `Your Moon in ${chart.moon.sign} (${moonInfo.element}) colours your emotional world.`,
  ];

  if (!chart.rising.requiresTime) {
    const riseInfo = getZodiacInfo(chart.rising.sign);
    parts.push(`${chart.rising.sign} Rising (${riseInfo.element}) defines your outer presence.`);
  } else {
    parts.push('Add your birth time to unlock your Rising sign.');
  }

  return parts.join(' ');
}

/** Phase emoji for display. */
export function getMoonPhaseEmoji(phase: MoonPhaseName): string {
  const map: Record<MoonPhaseName, string> = {
    'New Moon':        '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter':   '🌓',
    'Waxing Gibbous':  '🌔',
    'Full Moon':       '🌕',
    'Waning Gibbous':  '🌖',
    'Last Quarter':    '🌗',
    'Waning Crescent': '🌘',
  };
  return map[phase];
}
