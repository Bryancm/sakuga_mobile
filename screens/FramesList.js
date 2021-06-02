import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const CheckmarkIcon = (props) => <Icon {...props} name="checkmark-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const FramesListScreen = ({ navigation, route }) => {
  const startTime = route.params.startTime;
  const endTime = route.params.endTime;
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;

  const [selectView, setSelectView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [frames, setFrames] = useState([]);

  const getVideoFrames = useCallback(async () => {
    try {
      const newFrames = [];
      const directory = `${RNFS.CachesDirectoryPath}/framesCache`;
      const exist = await RNFS.exists(directory);
      if (exist) await RNFS.unlink(directory);
      await RNFS.mkdir(directory);
      const date = new Date().valueOf();
      const dif = startTime - 1;
      const seek = dif <= 0 ? '00:00.0' : formatSeconds(dif);
      const from = dif <= 0 ? '00:00.0' : formatSeconds(startTime - dif);
      const duration = formatSeconds(endTime - startTime);
      const command = `-nostats -loglevel 0 -ss 00:${seek} -i ${url} -ss 00:${from} -t 00:${duration} -vsync 0 -q:v 1 "${directory}/${title}_${id}_${date}_%03d.jpg"`;
      await RNFFmpeg.execute(command);
      const dir = await RNFS.readDir(directory);
      for (const d of dir) {
        newFrames.push({
          uri: Platform.OS === 'android' ? 'file://' + d.path : d.path,
        });
      }
      newFrames.sort((a, b) => ('' + a.uri).localeCompare(b.uri));
      setFrames(newFrames);
      setLoading(false);
    } catch (error) {
      console.log('ERROR FRAMES', error);
      setLoading(false);
    }
  }, [startTime, endTime, frames, url, id]);

  useEffect(() => {
    getVideoFrames();
  }, []);

  const toggleSelectView = () => {
    setSelectView(!selectView);
  };

  const navigateBack = () => {
    navigation.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={selectView ? CloseIcon : CheckmarkIcon} onPress={toggleSelectView} />
      {selectView && <TopNavigationAction icon={DownloadIcon} onPress={toggleSelectView} />}
    </React.Fragment>
  );
  const renderItem = ({ item }) => (
    <FastImage style={{ width: '33%', height: 100, marginRight: 2, marginBottom: 2 }} source={item} />
  );

  const keyExtractor = (item) => item.uri;

  if (loading)
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation
            title="Frames"
            subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
            alignment="center"
            accessoryLeft={renderBackAction}
          />
          <Divider />
          <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
          </Layout>
        </SafeAreaView>
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Frames"
          subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
          alignment="center"
          accessoryLeft={renderBackAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <FlatList
            data={frames}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          />
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
