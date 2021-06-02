/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, AppState, Platform } from 'react-native';
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';
import { AppNavigator } from './navigation/Navigator';
import RNFS from 'react-native-fs';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
// const HeartIcon = (props) => <Icon {...props} name="heart" />;

export default () => {
  const removeDir = async (dir) => {
    const exist = await RNFS.exists(dir);
    if (exist) await RNFS.unlink(dir);
  };

  const removeFiles = async (directory) => {
    const cache_file_limit = 10;
    const exist = await RNFS.exists(directory);
    if (exist) {
      const dir = await RNFS.readDir(directory);
      if (dir.length > cache_file_limit) {
        dir.sort((a, b) => new Date(a.mtime) - new Date(b.mtime));
        const diff = dir.length - cache_file_limit;
        const files_to_delete = dir.slice(0, diff);
        for (const file of files_to_delete) {
          await RNFS.unlink(file.path);
        }
      }
    }
  };

  const cleanCache = async () => {
    try {
      if (Platform.OS === 'android') {
        const dir = `/storage/emulated/0/Android/data/com.sakugamobile/cache/video-cache`;
        removeFiles(dir);
      } else {
        const video_dir = `${RNFS.DocumentDirectoryPath}/KTVHTTPCache`;
        const sdimage_dir = `${RNFS.CachesDirectoryPath}/com.hackemist.SDImageCache/default`;
        const frames_dir = `${RNFS.CachesDirectoryPath}/framesCache`;
        const gif_dir = `${RNFS.CachesDirectoryPath}/gifCache`;
        removeFiles(video_dir);
        removeFiles(sdimage_dir);
        removeDir(frames_dir);
        removeDir(gif_dir);
      }
    } catch (error) {
      console.log('CLEAN_CACHE_ERROR: ', error);
    }
  };

  const handleAppState = (state) => {
    if (state === 'inactive' || state === 'background') cleanCache();
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppState);
    return () => {
      AppState.removeEventListener('change', handleAppState);
    };
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }} customMapping={mapping}>
        <Layout style={styles.container}>
          <AppNavigator />
        </Layout>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
