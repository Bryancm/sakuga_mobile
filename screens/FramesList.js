import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  PermissionsAndroid,
} from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon, Text } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';
import ImageView from 'react-native-image-viewing';
import { scale, verticalScale } from 'react-native-size-matters';

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const CheckmarkIcon = (props) => (
  <Icon
    style={{ position: 'absolute', bottom: 2, right: 2, width: 25, height: 25, zIndex: 10 }}
    name="checkmark-circle-2"
    fill="#E3170A"
  />
);
const SelectIcon = () => <Text category="s2">Select</Text>;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const ShareIcon = (props) => <Icon {...props} name="share-outline" />;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const FramesListScreen = ({ navigation, route }) => {
  const mounted = useRef(true);
  const startTime = route.params.startTime;
  const endTime = route.params.endTime;
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;

  const [selectView, setSelectView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [frames, setFrames] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);

  const { width } = useWindowDimensions();

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
      const fileName = title.replace(/\s/g, '_').replace(/:/g, '_');
      const command = `-nostats -loglevel 0 -ss 00:${seek} -i ${url} -ss 00:${from} -t 00:${duration} -vsync 0 -q:v 1 "${directory}/${fileName}_${id}_${date}_%03d.jpg"`;
      await RNFFmpeg.execute(command);
      const dir = await RNFS.readDir(directory);
      for (const d of dir) {
        newFrames.push({
          uri: Platform.OS === 'android' ? 'file://' + d.path : d.path,
        });
      }
      newFrames.sort((a, b) => ('' + a.uri).localeCompare(b.uri));
      if (mounted.current) setFrames(newFrames);
      if (mounted.current) setLoading(false);
    } catch (error) {
      console.log('ERROR FRAMES', error);
      if (mounted.current) setLoading(false);
    }
  }, [startTime, endTime, frames, url, id]);

  useEffect(() => {
    mounted.current = true;
    getVideoFrames();
    return () => {
      mounted.current = false;
    };
  }, []);

  const toggleSelectView = () => {
    if (selectView) clearSelectedItems();
    setSelectView(!selectView);
  };

  const navigateBack = () => {
    navigation.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const renderRightActions = () =>
    loadingImages ? (
      <React.Fragment>
        <ActivityIndicator color="#D4D4D4" />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <TopNavigationAction icon={selectView ? CloseIcon : SelectIcon} onPress={toggleSelectView} />
        {selectView && (
          <TopNavigationAction
            icon={Platform.OS === 'android' ? ShareIcon : DownloadIcon}
            onPress={shareMultipleImages}
          />
        )}
        {selectView && Platform.OS === 'android' && (
          <TopNavigationAction icon={DownloadIcon} onPress={downloadMultipleImages} />
        )}
      </React.Fragment>
    );

  const clearSelectedItems = () => {
    const newFrames = frames.map((f) => ({ uri: f.uri, selected: false }));
    setFrames(newFrames);
  };

  const shareMultipleImages = async () => {
    try {
      setLoadingImages(true);
      const urls = frames.filter((f) => f.selected).map((f) => f.uri);
      if (!urls || urls.length === 0) return Toast.show('Please select a image');
      const shareOptions = {
        title: 'Share frames',
        message: title ? title : 'frames',
        failOnCancel: false,
        urls,
        type: 'image/jpeg',
      };
      await Share.open(shareOptions);
      setLoadingImages(false);
    } catch (error) {
      setLoadingImages(false);
      Toast.show('Error, Please try again later :(');
      console.log('SHARE_MULTIPLE_ERROR: ', error);
    }
  };

  const requestPermission = async () => {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
    return false;
  };

  const downloadMultipleImages = async () => {
    try {
      setLoadingImages(true);
      const checkPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (!checkPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Toast.showWithGravity('Permission needed to download images or videos', Toast.SHORT, Toast.CENTER);
          return setLoadingImages(false);
        }
      }

      const fileName = title.replace(/\s/g, '_').replace(/:/g, '_');
      const urls = frames.filter((f) => f.selected).map((f, i) => ({ uri: f.uri, name: `${fileName}_${id}_${i}` }));
      for (const url of urls) {
        const destPath = `${RNFS.DownloadDirectoryPath}/${url.name}.jpg`;
        await RNFS.copyFile(url.uri, destPath);
      }
      Toast.showWithGravity('Success! Files downloaded', Toast.SHORT, Toast.CENTER);
      setLoadingImages(false);
    } catch (error) {
      Toast.show('Error, Please try again later :(');
      console.log('DOWNLOAD_MULTIPLE_ERROR: ', error);
      setLoadingImages(false);
    }
  };

  const selectItem = (index) => {
    const newFrames = [...frames];
    newFrames[index] = { uri: newFrames[index].uri, selected: newFrames[index].selected ? false : true };
    setFrames(newFrames);
  };

  const openImage = ({ item, index }) => {
    if (Platform.OS === 'ios') return RNFetchBlob.ios.openDocument(item.uri);
    setImageIndex(index);
    setIsVisible(true);
  };

  const onItemPress = ({ item, index }) => {
    selectView ? selectItem(index) : openImage({ item, index });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={{
        width: !Platform.isPad || width <= 375 ? '33%' : '25%',
        height: !Platform.isPad || width <= 375 ? verticalScale(80) : verticalScale(100),
        marginRight: 2,
        marginBottom: 2,
      }}
      onPress={() => onItemPress({ item, index })}>
      <FastImage style={{ width: '100%', height: '100%' }} source={item} />
      {item.selected && <CheckmarkIcon />}
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.uri;

  const closeImageView = () => setIsVisible(false);

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
            <ActivityIndicator color="#D4D4D4" />
          </Layout>
        </SafeAreaView>
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {Platform.OS === 'android' && (
          <ImageView
            images={frames}
            imageIndex={imageIndex}
            visible={visible}
            onRequestClose={closeImageView}
            swipeToCloseEnabled={false}
          />
        )}
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
            key={`w-${width}`}
            data={frames}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={!Platform.isPad || width <= 375 ? 3 : 4}
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
