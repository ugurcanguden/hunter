module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@centerhit-app': './src/app',
          '@centerhit-components': './src/components',
          '@centerhit-core': './src/core',
          '@centerhit-features': './src/features',
          '@centerhit-game': './src/game',
        },
      },
    ],
  ],
};
