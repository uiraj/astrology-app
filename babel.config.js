module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: [
      // jsxImportSource enables className prop transform on all RN components.
      // Skip in Jest — nativewind/babel causes Babel errors in the test runner.
      isTest
        ? 'babel-preset-expo'
        : ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // nativewind/babel is a preset (returns { plugins: [...] }), NOT a plugin.
      // Only include it for Metro builds; Jest excludes it for compatibility.
      ...(isTest ? [] : ['nativewind/babel']),
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './src' },
        },
      ],
    ],
  };
};
