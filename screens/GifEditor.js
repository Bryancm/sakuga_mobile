import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Divider, Icon, Layout, Button, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

const GifIcon = () => (
  <Text style={{ paddingTop: 3, fontWeight: 'bold' }} category="s1">
    GIF
  </Text>
);
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const PlayIcon = () => <Icon name="play-circle-outline" style={{ width: 40, height: 40 }} fill="#D4D4D4" />;
const PauseIcon = () => <Icon name="pause-circle-outline" style={{ width: 40, height: 40 }} fill="#D4D4D4" />;
const screenWidth = Dimensions.get('window').width;

const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 5);
};

export const GifEditorScreen = ({ navigation, route }) => {
  const videoPlayer = React.useRef();
  const url = route.params.url;
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeTrimmer, setCurrentTimeTrimmer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState();
  const [play, setPlay] = useState(false);
  const [replay, setReplay] = useState(false);
  const [fps, setFPS] = useState(8);

  useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current
        .getVideoInfo()
        .then((r) => {
          // console.log(r);
          setEndTime(r.duration);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  const onVideoChange = useCallback(
    ({ nativeEvent }) => {
      if (play) setCurrentTimeTrimmer(nativeEvent.currentTime);
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

  const changeFPS = useCallback((fps) => {
    setFPS(fps);
  }, []);

  const renderLeftAction = () => <TopNavigationAction icon={CloseIcon} onPress={() => navigation.goBack()} />;

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={GifIcon} />
      <TopNavigationAction icon={GridIcon} />
    </React.Fragment>
  );

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
          <Layout style={styles.buttonContainer}>
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
          <Trimmer
            source={url}
            height={60}
            width={screenWidth - 8}
            onTrackerMove={onTrackerMove} // iOS only
            currentTime={currentTimeTrimmer} // use this prop to set tracker position iOS only
            themeColor="#C3070B" // iOS only
            trackerColor="#C3070B" // iOS only
            onChange={onTrimmerChange}
            minLength={1}
            thumbWidth={11}
          />
          <Button
            status="basic"
            appearance="ghost"
            style={styles.pauseButton}
            onPress={toggleVideo}
            accessoryRight={play ? PauseIcon : PlayIcon}
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
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
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
    bottom: '8%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
