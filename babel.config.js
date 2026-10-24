module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          '@components': './src/presentation/components',
          '@data': './src/data',
          '@domain': './src/domain',
          '@navigation': './src/presentation/navigation',
          '@locales': './src/locales',
          '@presentation': './src/presentation',
          '@screens': './src/presentation/pages',
        },
      },
    ],
  ],
};
