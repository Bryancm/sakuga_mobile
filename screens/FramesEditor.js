import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Divider, Icon, Layout, Button, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const ArrowRightIcon = () => <Icon name="arrowhead-right-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const ArrowLeftIcon = () => <Icon name="arrowhead-left-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PlayIcon = () => <Icon name="play-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const PauseIcon = () => <Icon name="pause-circle-outline" style={{ width: 25, height: 25 }} fill="#D4D4D4" />;
const screenWidth = Dimensions.get('window').width;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 5);
};

export const FramesEditorScreen = ({ navigation, route }) => {
  const videoPlayer = React.useRef();
  const url = route.params.url;
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeTrimmer, setCurrentTimeTrimmer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState();
  const [play, setPlay] = useState(false);
  const [replay, setReplay] = useState(false);
  const [totalFPS, setTotalFPS] = useState(0);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  // const [longPressInterval, setLongPressInterval] = useState();

  useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current
        .getVideoInfo()
        .then((r) => {
          // console.log(r);
          setEndTime(r.duration);
          setTotalFPS(Math.round(r.duration / 0.042));
        })
        .catch((e) => console.log(e));
    }
  }, []);

  const onVideoChange = useCallback(
    ({ nativeEvent }) => {
      if (play) setCurrentTimeTrimmer(nativeEvent.currentTime);
      setCurrentFPS(Math.round(nativeEvent.currentTime / 0.042));
    },
    [play],
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

  const renderLeftAction = () => <TopNavigationAction icon={CloseIcon} onPress={() => navigation.goBack()} />;

  const navigateFramesList = () => {
    navigation.navigate('FramesList', { startTime, endTime });
  };

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={GridIcon} onPress={navigateFramesList} />
    </React.Fragment>
  );

  const stepFoward = useCallback(() => {
    const stepTime = 0.042 * stepCount;
    const current = play ? currentTimeTrimmer : currentTime;
    setCurrentTime(current + stepTime);
    setCurrentTimeTrimmer(current + stepTime);
    if (play) {
      setPlay(false);
      setReplay(false);
    }
  }, [currentTime, play, stepCount, currentTimeTrimmer]);

  const stepBackward = useCallback(() => {
    const stepTime = 0.042 * stepCount;
    const current = play ? currentTimeTrimmer : currentTime;
    setCurrentTime(current - stepTime);
    setCurrentTimeTrimmer(current - stepTime);
    if (play) {
      setPlay(false);
      setReplay(false);
    }
  }, [currentTime, play, stepCount, currentTimeTrimmer]);

  const changeStepCount = useCallback(() => {
    if (stepCount === 1) setStepCount(2);
    if (stepCount === 2) setStepCount(3);
    if (stepCount === 3) setStepCount(1);
  }, [stepCount]);

  // const onLongPressBackward = useCallback(() => {
  //   setLongPressInterval(setInterval(() => stepBackward(), 2000));
  // }, []);

  // const onPressOut = useCallback(() => {
  //   window.clearInterval(longPressInterval);
  //   setLongPressInterval();
  // }, [longPressInterval]);

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Trim"
          subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
          alignment="center"
          accessoryLeft={renderLeftAction}
          accessoryRight={renderRightActions}
        />
        <Divider />

        <VideoPlayer
          ref={videoPlayer}
          startTime={startTime} // seconds
          endTime={endTime} // seconds
          play={play} // default false
          replay={replay} // should player play video again if it's ended
          currentTime={currentTime}
          source={url}
          style={{ backgroundColor: 'black' }}
          resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
          onChange={onVideoChange} // get Current time on every second
        />

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
                accessoryRight={play ? PauseIcon : PlayIcon}
              />
              <Button
                appearance="ghost"
                style={styles.pauseButton}
                onPress={stepBackward}
                accessoryRight={ArrowLeftIcon}
                // onLongPress={onLongPressBackward}
                // onPressOut={onPressOut}
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

          <Trimmer
            source={url}
            height={60}
            width={screenWidth - 8}
            onTrackerMove={onTrackerMove} // iOS only
            currentTime={currentTimeTrimmer} // use this prop to set tracker position iOS only
            themeColor="#C3070B" // iOS only
            trackerColor="#C3070B" // iOS only
            trackerHandleColor="#C3070B"
            onChange={onTrimmerChange}
            minLength={1}
            thumbWidth={10}
            showTrackerHandle={true}
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
    bottom: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
