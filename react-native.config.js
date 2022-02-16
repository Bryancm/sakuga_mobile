module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets'],
  dependencies: {
    'react-native-video-processing': {
      platforms: {
        android: null,
      },
    },
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        },
      },
    },
  },
};
