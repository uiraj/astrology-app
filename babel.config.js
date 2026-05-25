module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './src' },
        },
      ],
      // NativeWind babel plugin is only needed for Metro (dev/prod builds).
      // Excluding it in Jest avoids a Babel plugin compatibility error.
      ...(process.env.NODE_ENV === 'test' ? [] : ['nativewind/babel']),
    ],
  };
};
