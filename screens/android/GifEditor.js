import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, PermissionsAndroid, ActivityIndicator, Platform } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Button,
  Text,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import { RNFFprobe, RNFFmpegConfig, RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import VideoPlayer from 'react-native-video-controls';
import { Slider } from '../../components/slider';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const PlayIcon = () => <Icon name="play-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PauseIcon = () => <Icon name="pause-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const ShareIcon = (props) => <Icon {...props} name="share-outline" />;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const GifEditorScreenAndroid = ({ navigation, route }) => {
  var abortController = new AbortController();
  const mounted = useRef(true);
  const video = useRef();
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;

  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState();
  const [fps, setFPS] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadingGIF, setLoadingGIF] = useState(false);
  const [paused, setPaused] = useState(false);
  const [usingSlider, setUsingSlider] = useState(false);
  const [duration, setDuration] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [rate, setRate] = useState(1);

  const toggleMenu = useCallback(() => {
    setPaused(true);
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const menuAnchor = useCallback(
    () => (
      <Button
        delayPressIn={0}
        delayPressOut={0}
        appearance="ghost"
        style={styles.pauseButton}
        onPress={toggleMenu}
        accessoryRight={() => <Text category="c1">{`x${rate}`}</Text>}
      />
    ),
    [menuVisible],
  );

  const updateRate = useCallback((rate) => {
    setRate(rate);
    setMenuVisible(false);
    setPaused(false);
  }, []);

  const RateMenu = useCallback(
    () => (
      <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem key="1" title={<Text category="c1">x0.05</Text>} onPress={() => updateRate(0.05)} />
        <MenuItem key="2" title={<Text category="c1">x0.1</Text>} onPress={() => updateRate(0.1)} />
        <MenuItem key="3" title={<Text category="c1">x0.25</Text>} onPress={() => updateRate(0.25)} />
        <MenuItem key="4" title={<Text category="c1">x0.50</Text>} onPress={() => updateRate(0.5)} />
        <MenuItem key="5" title={<Text category="c1">x0.75</Text>} onPress={() => updateRate(0.75)} />
        <MenuItem key="6" title={<Text category="c1">x1</Text>} onPress={() => updateRate(1)} />
        <MenuItem key="7" title={<Text category="c1">x1.25</Text>} onPress={() => updateRate(1.25)} />
        <MenuItem key="8" title={<Text category="c1">x1.50</Text>} onPress={() => updateRate(1.5)} />
        <MenuItem key="9" title={<Text category="c1">x1.75</Text>} onPress={() => updateRate(1.75)} />
        <MenuItem key="10" title={<Text category="c1">x2</Text>} onPress={() => updateRate(2)} />
      </OverflowMenu>
    ),
    [menuVisible],
  );

  const deleteGIFCache = useCallback(async () => {
    const dir = `${RNFS.CachesDirectoryPath}/gifCache`;
    const exist = await RNFS.exists(dir);
    if (exist) await RNFS.unlink(dir);
  }, []);

  const loadVideo = useCallback(async () => {
    try {
      RNFFmpegConfig.disableLogs();
      await fetch(url, { signal: abortController.signal });
      await RNFFprobe.getMediaInformation(url)
        .then((info) => {
          const allProperties = info.getAllProperties();
          const duration = Number(allProperties.format.duration);
          const splitFrameRate = allProperties.streams[0].avg_frame_rate.split('/');
          const frameRate = splitFrameRate[0] / splitFrameRate[1];
          setVideoInfo({ duration, frameRate });
        })
        .catch((e) => console.log('MEDIA_INFO_ERROR: ', e));
      if (mounted.current) setLoading(false);
    } catch (error) {
      console.log('DOWNLOAD_VIDEO_ERROR: ', error);
      if (mounted.current) setLoading(false);
    }
  }, [mounted]);

  const setVideoInfo = useCallback((info) => {
    setEndTime(info.duration);
    setDuration(info.duration);
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadVideo();
    return () => {
      abortController.abort();
      mounted.current = false;
      deleteGIFCache();
    };
  }, []);

  const toggleVideo = useCallback(() => {
    setUsingSlider(false);
    setPaused(!paused);
  }, [paused]);

  const changeFPS = useCallback((fps) => {
    setFPS(fps);
  }, []);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const renderLeftAction = useCallback(() => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />, []);

  const onNextPressed = useCallback(
    async (share) => {
      const dir = `${RNFS.CachesDirectoryPath}/gifCache`;
      try {
        setLoadingGIF(true);
        const isIOS = Platform.OS === 'ios';
        await RNFS.mkdir(dir);
        const date = new Date().valueOf();
        const t = title ? title.replace(/\s/g, '_') : id;
        const dir_with_filename = `${dir}/${t}_${date}_${id}.gif`;
        const file_url = url;
        const command = `-nostats -loglevel 0 -ss ${startTime} -to ${endTime}  -i ${file_url} -vf "fps=${fps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 ${dir_with_filename}`;
        await RNFFmpeg.execute(command);
        const d = await RNFS.readDir(dir);
        d.sort((a, b) => new Date(a.mtime) - new Date(b.mtime));
        const lastItem = d.pop();
        const path = Platform.OS === 'android' ? 'file://' + lastItem.path : lastItem.path;
        if (isIOS) RNFetchBlob.ios.openDocument(path);
        if (share && !isIOS) await shareGif(path);
        if (!share && !isIOS) await downloadGif(path);
        if (mounted.current) setLoadingGIF(false);
      } catch (error) {
        console.log('SHARE GIF ERROR: ', error);
        if (mounted.current) setLoadingGIF(false);
      }
    },
    [startTime, endTime, title, id, file_ext, fps],
  );
  const requestPermission = useCallback(async () => {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
    return false;
  }, []);

  const downloadGif = useCallback(async (url) => {
    const checkPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (!checkPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Toast.showWithGravity('Permission needed to download images or videos', Toast.SHORT, Toast.CENTER);
        return setLoadingImages(false);
      }
    }
    const fileName = title.replace(/\s/g, '_').replace(/:/g, '_');
    const date = new Date().valueOf();
    const name = `${fileName}_${id}_${date}`;
    const destPath = `${RNFS.DownloadDirectoryPath}/${name}.gif`;
    await RNFS.copyFile(url, destPath);
    Toast.showWithGravity('Success! Files downloaded', Toast.SHORT, Toast.CENTER);
  }, []);
  const shareGif = useCallback(async (url) => {
    const shareOptions = {
      title: 'Share GIF',
      message: title ? title : 'GIF',
      failOnCancel: false,
      url,
      type: 'image/gif',
    };
    await Share.open(shareOptions);
  }, []);

  const renderRightActions = useCallback(
    () =>
      loadingGIF ? (
        <React.Fragment>
          <ActivityIndicator color="#D4D4D4" />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <TopNavigationAction icon={ShareIcon} onPress={() => onNextPressed(true)} />
          <TopNavigationAction icon={DownloadIcon} onPress={() => onNextPressed(false)} />
        </React.Fragment>
      ),
    [loadingGIF, startTime, endTime, fps],
  );

  const setPositionAsync = useCallback((time, play) => {
    setCurrentTime(time);
    video.current.methods.seekTo(time);
    play ? setPaused(false) : setPaused(true);
  }, []);

  const onProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
  }, []);

  if (loading)
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation
            title="Gif Trim"
            subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
            alignment="center"
            accessoryLeft={renderLeftAction}
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
        <TopNavigation
          title="Gif Trim"
          subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
          alignment="center"
          accessoryLeft={renderLeftAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
        <Layout style={{ flex: 1, paddingTop: '30%' }}>
          <Layout style={styles.image}>
            <VideoPlayer
              ref={video}
              paused={paused}
              repeat={true}
              muted={true}
              source={{ uri: url }}
              resizeMode="contain"
              onProgress={onProgress}
              progressUpdateInterval={1000}
              disableFullscreen
              disablePlayPause
              disableVolume
              disableTimer
              disableBack
              disableSeekbar
              scrubbing={1}
              controlAnimationTiming={1}
              controlTimeout={1}
              showOnStart={false}
              rate={rate}
            />
          </Layout>
          <Layout style={styles.controlContainer}>
            <Layout
              style={{
                ...styles.buttonContainer,
                justifyContent: 'flex-start',
                marginBottom: 0,
                paddingHorizontal: 8,
                backgroundColor: 'transparent',
              }}>
              <Button
                appearance="ghost"
                style={styles.pauseButton}
                onPress={toggleVideo}
                accessoryRight={paused ? PlayIcon : PauseIcon}
              />
              <RateMenu />
            </Layout>
            <Layout style={{ ...styles.buttonContainer, marginBottom: 45 }}>
              <Button size="small" appearance="ghost" onPress={() => changeFPS(5)}>
                <Text status={fps === 5 ? 'primary' : 'basic'} category={fps === 5 ? 's1' : 's2'}>
                  5 FPS
                </Text>
              </Button>
              <Button size="small" appearance="ghost" onPress={() => changeFPS(8)}>
                <Text status={fps === 8 ? 'primary' : 'basic'} category={fps === 8 ? 's1' : 's2'}>
                  8 FPS
                </Text>
              </Button>
              <Button size="small" appearance="ghost" onPress={() => changeFPS(12)}>
                <Text status={fps === 12 ? 'primary' : 'basic'} category={fps === 12 ? 's1' : 's2'}>
                  12 FPS
                </Text>
              </Button>

              <Button size="small" appearance="ghost" onPress={() => changeFPS(24)}>
                <Text status={fps === 24 ? 'primary' : 'basic'} category={fps === 24 ? 's1' : 's2'}>
                  24 FPS
                </Text>
              </Button>
              <Button size="small" appearance="ghost" onPress={() => changeFPS(30)}>
                <Text status={fps === 30 ? 'primary' : 'basic'} category={fps === 30 ? 's1' : 's2'}>
                  30 FPS
                </Text>
              </Button>
            </Layout>
            {duration && (
              <Slider
                duration={duration}
                currentTime={currentTime}
                setPositionAsync={setPositionAsync}
                usingSlider={usingSlider}
                setUsingSlider={setUsingSlider}
                setEndTime={setEndTime}
                setStartTime={setStartTime}
                setPaused={setPaused}
              />
            )}
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    paddingLeft: 8,
    paddingTop: 0,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: 320, backgroundColor: '#000' },
  pauseButton: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 25,
    backgroundColor: '#292929',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  controlContainer: {
    position: 'absolute',
    bottom: '18%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
