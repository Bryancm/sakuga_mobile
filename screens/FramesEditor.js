import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Divider, Icon, Layout, Button, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
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
const screenWidth = Dimensions.get('window').width;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const FramesEditorScreen = ({ navigation, route }) => {
  var abortController = new AbortController();
  const mounted = useRef(true);
  // const videoPlayer = useRef();
  const video = useRef();
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;
  const item = route.params.item;

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeTrimmer, setCurrentTimeTrimmer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [play, setPlay] = useState(true);
  const [replay, setReplay] = useState(true);
  const [totalFPS, setTotalFPS] = useState(0);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [stepSize, setStepSize] = useState(0.042);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [usingSlider, setUsingSlider] = useState(false);
  const [duration, setDuration] = useState(false);

  const deleteFramesCache = async () => {
    const dir = `${RNFS.CachesDirectoryPath}/framesCache`;
    const exist = await RNFS.exists(dir);
    if (exist) await RNFS.unlink(dir);
  };

  const loadVideo = async () => {
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
  };

  const setVideoInfo = (info) => {
    const step = 1 / info.frameRate;
    const stepSize = Number(step.toFixed(4));
    const totalFps = Math.round(info.duration / stepSize);
    setStepSize(stepSize);
    setTotalFPS(totalFps);
    setEndTime(info.duration);
    setDuration(info.duration);
  };

  useEffect(() => {
    mounted.current = true;
    loadVideo();
    return () => {
      abortController.abort();
      mounted.current = false;
      deleteFramesCache();
    };
  }, []);

  // useEffect(() => {
  //   if (videoPlayer.current) {
  //     videoPlayer.current
  //       .getVideoInfo()
  //       .then((r) => {
  //         // console.log(r);
  //         const step = 1 / 24;
  //         const stepSize = Number(step.toFixed(4));
  //         const totalFps = Math.round(r.duration / stepSize);
  //         setStepSize(stepSize);
  //         setTotalFPS(totalFps);
  //         setEndTime(r.duration);
  //         // console.log({ stepSize, totalFps, duration: r.duration });
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // }, [loading]);

  const toggleVideo = useCallback(() => {
    setUsingSlider(false);
    setPaused(!paused);
  }, [paused]);

  const navigateBack = () => {
    const setPaused = route.params.setPaused;
    if (setPaused) setPaused(false);
    navigation.goBack();
  };

  const renderLeftAction = () => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />;

  const navigateFramesList = () => {
    // console.log({ startTime, endTime, title, id, file_ext, url });
    navigation.navigate('FramesList', { startTime, endTime, title, id, file_ext, url });
  };

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={GridIcon} onPress={navigateFramesList} />
    </React.Fragment>
  );

  const stepFoward = useCallback(() => {
    const stepTime = stepSize * stepCount;
    const current = play ? currentTimeTrimmer : currentTime;
    setCurrentTime(current + stepTime);
    setCurrentTimeTrimmer(current + stepTime);
    if (play) {
      setPlay(false);
      setReplay(false);
    }
  }, [currentTime, play, stepCount, currentTimeTrimmer, stepSize]);

  const stepBackward = useCallback(() => {
    const stepTime = stepSize * stepCount;
    const current = play ? currentTimeTrimmer : currentTime;
    setCurrentTime(current - stepTime);
    setCurrentTimeTrimmer(current - stepTime);
    if (play) {
      setPlay(false);
      setReplay(false);
    }
  }, [currentTime, play, stepCount, currentTimeTrimmer, stepSize]);

  const changeStepCount = useCallback(() => {
    if (stepCount === 1) setStepCount(2);
    if (stepCount === 2) setStepCount(3);
    if (stepCount === 3) setStepCount(1);
  }, [stepCount]);

  const setPositionAsync = (time, play) => {
    setCurrentTime(time);
    video.current.player.ref.seek(time);

    // video.current.seek(time, 0);
    play ? setPaused(false) : setPaused(true);
  };

  const onProgress = (progress) => {
    // console.log({ progress });
    if (progress.currentTime >= currentTime) {
      setCurrentTime(progress.currentTime);
    }
  };

  const onSeek = ({ currentTime, seekTime }) => {
    setCurrentTime(seekTime);
  };
  const onPlay = () => setPaused(false);
  const onPause = () => setPaused(true);
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
              onSeek={onSeek}
              onPlay={onPlay}
              onPause={onPause}
              progressUpdateInterval={1000}
              disableFullscreen
              disablePlayPause
              disableVolume
              disableTimer
              disableBack
              disableSeekbar
              // scrubbing={1}
              // tapAnywhereToPause={true}
              // controlTimeout={5000}
            />
          </Layout>

          <Layout style={styles.controlContainer}>
            <Layout
              style={{
                ...styles.buttonContainer,
                justifyContent: 'space-between',
                paddingHorizontal: 8,
              }}>
              <Layout
                style={{
                  ...styles.buttonContainer,
                  marginBottom: 0,
                  justifyContent: 'space-between',
                  width: '55%',
                }}>
                <Button
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={toggleVideo}
                  accessoryRight={paused ? PlayIcon : PauseIcon}
                />
                <Button
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={stepBackward}
                  accessoryRight={ArrowLeftIcon}
                />
                <Button
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={stepFoward}
                  accessoryRight={ArrowRightIcon}
                />
                <Button
                  appearance="ghost"
                  style={styles.pauseButton}
                  onPress={changeStepCount}
                  accessoryRight={() => <Text category="s2">{`x${stepCount}`}</Text>}
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
