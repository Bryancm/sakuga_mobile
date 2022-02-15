import React from 'react';
import { Platform } from 'react-native';
import { GifEditorScreenAndroid } from './android/GifEditor';
import { GifEditorScreenIOS } from './ios/GifEditor';

export const GifEditorScreen = ({ navigation, route }) => {
  return Platform.OS === 'ios' ? (
    <GifEditorScreenIOS navigation={navigation} route={route} />
  ) : (
    <GifEditorScreenAndroid navigation={navigation} route={route} />
  );
};
