module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Swap AsyncStorage for its Jest mock so native module errors don't surface
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock',
    // Mock CSS imports (global.css used by NativeWind)
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    // Transform everything except node_modules that are NOT in this list.
    // Firebase, NativeWind, and react-native-css-interop ship ESM and must be transformed.
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|firebase|@firebase|nativewind|react-native-css-interop)',
  ],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
};
