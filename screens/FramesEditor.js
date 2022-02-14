import React from 'react';
import { Platform } from 'react-native';
import { FramesEditorScreenAndroid } from './android/FramesEditor';
import { FramesEditorScreenIOS } from './ios/FramesEditor';

export const FramesEditorScreen = ({ navigation, route }) => {
  return Platform.OS === 'ios' ? (
    <FramesEditorScreenIOS navigation={navigation} route={route} />
  ) : (
    <FramesEditorScreenAndroid navigation={navigation} route={route} />
  );
};
