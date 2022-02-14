import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
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
import { RNFFprobe, RNFFmpegConfig } from 'react-native-ffmpeg';
import VideoPlayer from 'react-native-video-controls';
import { Slider } from '../components/slider';
import RNFS from 'react-native-fs';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const ArrowRightIcon = () => <Icon name="arrowhead-right-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const ArrowLeftIcon = () => <Icon name="arrowhead-left-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PlayIcon = () => <Icon name="play-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PauseIcon = () => <Icon name="pause-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const FramesEditorScreenAndroid = ({ navigation, route }) => {
  var abortController = new AbortController();
  const mounted = useRef(true);
  const video = useRef();
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;

  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [totalFPS, setTotalFPS] = useState(0);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [stepSize, setStepSize] = useState(0.042);
  const [loading, setLoading] = useState(true);
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

  const deleteFramesCache = useCallback(async () => {
    const dir = `${RNFS.CachesDirectoryPath}/framesCache`;
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
    const step = 1 / info.frameRate;
    const stepSize = Number(step.toFixed(4));
    const totalFps = Math.round(info.duration / stepSize);
    setStepSize(stepSize);
    setTotalFPS(totalFps);
    setEndTime(info.duration);
    setDuration(info.duration);
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadVideo();
    return () => {
      abortController.abort();
      mounted.current = false;
      deleteFramesCache();
    };
  }, []);

  const toggleVideo = useCallback(() => {
    setUsingSlider(false);
    setPaused(!paused);
  }, [paused]);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const renderLeftAction = useCallback(() => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />, []);

  const navigateFramesList = useCallback(() => {
    setPaused(true);
    navigation.navigate('FramesList', { startTime, endTime, title, id, file_ext, url });
  }, [startTime, endTime]);

  const renderRightActions = useCallback(
    () => (
      <React.Fragment>
        <TopNavigationAction icon={GridIcon} onPress={navigateFramesList} />
      </React.Fragment>
    ),
    [startTime, endTime],
  );

  const stepFoward = useCallback(() => {
    const stepTime = stepSize * stepCount;
    const time = currentTime + stepTime;
    // console.log({ time });
    setCurrentTime(time);
    video.current.methods.seekTo(time);
    if (!paused) setPaused(true);
  }, [currentTime, paused, stepCount, stepSize]);

  const stepBackward = useCallback(() => {
    const stepTime = stepSize * stepCount;
    const time = currentTime - stepTime;
    // console.log({ time });
    setCurrentTime(time);
    video.current.methods.seekTo(time);
    if (!paused) setPaused(true);
  }, [currentTime, paused, stepCount, stepSize]);

  const changeStepCount = useCallback(() => {
    if (stepCount === 1) setStepCount(2);
    if (stepCount === 2) setStepCount(3);
    if (stepCount === 3) setStepCount(1);
  }, [stepCount]);

  const setPositionAsync = useCallback((time, play) => {
    setCurrentTime(time);
    video.current.methods.seekTo(time);
    play ? setPaused(false) : setPaused(true);
  }, []);

  const onProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
  }, []);

  useEffect(() => {
    setCurrentFPS(Math.round(currentTime / stepSize));
  }, [currentTime]);

  if (loading)
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation
            title="Frames Trim"
            subtitle={`${formatSeconds(currentTime)} ~ ${formatSeconds(endTime)}`}
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
          title="Frames Trim"
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
                justifyContent: 'space-between',
                paddingHorizontal: 8,
                marginBottom: 50,
              }}>
              <Layout
                style={{
                  ...styles.buttonContainer,
                  marginBottom: 0,
                  justifyContent: 'space-between',
                  width: '57%',
                }}>
                <Button
                  delayPressIn={0}
                  delayPressOut={0}
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={toggleVideo}
                  accessoryRight={paused ? PlayIcon : PauseIcon}
                />
                <RateMenu />
                <Button
                  delayPressIn={0}
                  delayPressOut={0}
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={stepBackward}
                  accessoryRight={ArrowLeftIcon}
                />
                <Button
                  delayPressIn={0}
                  delayPressOut={0}
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={stepFoward}
                  accessoryRight={ArrowRightIcon}
                />
                <Button
                  delayPressIn={0}
                  delayPressOut={0}
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={changeStepCount}
                  accessoryRight={() => <Text category="c1">{`x${stepCount}f`}</Text>}
                />
              </Layout>
              <Text status="primary" category="s2">
                {`${currentFPS} / ${totalFPS}`}
              </Text>
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
  videoContainer: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
  },
  image: {
    width: '100%',
    height: 320,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
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
    bottom: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
