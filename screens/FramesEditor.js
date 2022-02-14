import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
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
import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import RNFS from 'react-native-fs';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const ArrowRightIcon = () => <Icon name="arrowhead-right-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const ArrowLeftIcon = () => <Icon name="arrowhead-left-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PlayIcon = () => <Icon name="play-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PauseIcon = () => <Icon name="pause-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 8);
};

export const FramesEditorScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  var abortController = new AbortController();
  const mounted = useRef(true);
  const videoPlayer = useRef();
  const id = route.params.id;
  const title = route.params.title;
  const file_ext = route.params.file_ext;
  const url = route.params.url;

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeTrimmer, setCurrentTimeTrimmer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState();
  const [play, setPlay] = useState(true);
  const [replay, setReplay] = useState(true);
  const [totalFPS, setTotalFPS] = useState(0);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [stepSize, setStepSize] = useState(0.042);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rate, setRate] = useState(1);

  const toggleMenu = useCallback(() => {
    setPlay(false);
    setReplay(false);
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
    setPlay(true);
    setReplay(true);
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
      await fetch(url, { signal: abortController.signal });
      if (mounted.current) setLoading(false);
    } catch (error) {
      console.log('DOWNLOAD_VIDEO_ERROR: ', error);
      if (mounted.current) setLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    mounted.current = true;
    setTimeout(loadVideo, 500);
    return () => {
      abortController.abort();
      mounted.current = false;
      deleteFramesCache();
    };
  }, []);

  useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current
        .getVideoInfo()
        .then((r) => {
          const step = 1 / r.frameRate;
          const stepSize = Number(step.toFixed(4));
          const totalFps = Math.round(r.duration / stepSize);
          setStepSize(stepSize);
          setTotalFPS(totalFps);
          setEndTime(r.duration);
        })
        .catch((e) => console.log(e));
    }
  }, [loading]);

  const onVideoChange = useCallback(
    ({ nativeEvent }) => {
      if (play) setCurrentTimeTrimmer(nativeEvent.currentTime);
      setCurrentFPS(Math.round(nativeEvent.currentTime / stepSize));
    },
    [play, stepSize],
  );

  const onTrackerMove = useCallback(
    ({ currentTime }) => {
      if (play) {
        setPlay(false);
        setReplay(false);
      }

      setCurrentTime(currentTime);
      // setCurrentTimeTrimmer(currentTime);
    },
    [play],
  );

  const onTrimmerChange = useCallback(
    (e) => {
      if (play) {
        setPlay(false);
        setReplay(false);
      }

      if (e.startTime !== startTime) {
        setCurrentTime(e.startTime);
      }
      if (e.endTime !== endTime) {
        setCurrentTime(e.endTime);
      }
      setStartTime(e.startTime);
      setEndTime(e.endTime);
    },
    [startTime, endTime, play],
  );

  const toggleVideo = useCallback(() => {
    setPlay(!play);
    setReplay(!replay);
  }, [play, replay]);

  const navigateBack = useCallback(() => {
    const setPaused = route.params.setPaused;
    if (setPaused) setPaused(false);
    navigation.goBack();
  }, []);

  const renderLeftAction = useCallback(
    () => <TopNavigationAction delayPressIn={0} delayPressOut={0} icon={CloseIcon} onPress={navigateBack} />,
    [],
  );

  const navigateFramesList = useCallback(() => {
    if (play) toggleVideo();
    navigation.navigate('FramesList', { startTime, endTime, title, id, file_ext, url });
  }, [play, startTime, endTime]);

  const renderRightActions = useCallback(
    () => (
      <React.Fragment>
        <TopNavigationAction delayPressIn={0} delayPressOut={0} icon={GridIcon} onPress={navigateFramesList} />
      </React.Fragment>
    ),
    [startTime, endTime],
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

  if (loading)
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation
            title="Frames Trim"
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
  const getWidthAndHeight = () => {
    var w = scale(270);
    var h = scale(270);
    var jc = 'flex-start';
    if (width < 694 && width >= 507) {
      w = scale(200);
      h = scale(200);
    } else if (width <= 375) {
      w = !Platform.isPad ? width : scale(140);
      h = !Platform.isPad ? scale(232) : scale(140);
      jc = 'flex-start';
    }
    return { w, h, jc };
  };

  const { w, h, jc } = getWidthAndHeight();

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
        <Layout
          style={{
            flex: 1,
            paddingTop: Platform.isPad ? 10 : '30%',
            justifyContent: jc,
            alignItems: 'center',
          }}>
          <Layout style={{ width: w, height: h }}>
            <VideoPlayer
              ref={videoPlayer}
              startTime={startTime} // seconds
              endTime={endTime} // seconds
              play={play} // default false
              replay={replay} // should player play video again if it's ended
              currentTime={currentTime}
              playerWidth={w}
              playerHeight={h}
              source={url}
              style={{ backgroundColor: 'black' }}
              resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
              onChange={onVideoChange} // get Current time on every second
              volume={rate}
            />
          </Layout>
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
                width: '70%',
              }}>
              <Button
                appearance="ghost"
                style={styles.pauseButton}
                onPress={toggleVideo}
                accessoryRight={play ? PauseIcon : PlayIcon}
              />
              <RateMenu />
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
                accessoryRight={() => <Text category="c1">{`x${stepCount}f`}</Text>}
              />
            </Layout>
            <Text status="primary" category="s2">
              {`${currentFPS} / ${totalFPS}`}
            </Text>
          </Layout>

          <Trimmer
            source={url}
            height={60}
            width={width}
            onTrackerMove={onTrackerMove} // iOS only
            currentTime={currentTimeTrimmer} // use this prop to set tracker position iOS only
            themeColor="#C3070B" // iOS only
            trackerColor="#C3070B" // iOS only
            trackerHandleColor="#C3070B"
            onChange={onTrimmerChange}
            minLength={1}
            thumbWidth={15}
            // showTrackerHandle={true}
          />
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
  image: { width: '100%', height: 210, backgroundColor: '#000' },
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
    bottom: Platform.isPad ? '5%' : '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
