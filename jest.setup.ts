import '@testing-library/jest-native/extend-expect';

// Silence noisy React Native warnings during tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
