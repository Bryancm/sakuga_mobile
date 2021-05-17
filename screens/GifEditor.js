import React from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  Keyboard,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Divider, Icon, Layout, Input, Button, Text } from '@ui-kitten/components';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const SendIcon = (props) => <Icon {...props} name="corner-down-right-outline" />;
const PlayIcon = (props) => <Icon {...props} name="play-circle-outline" />;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const GifEditorScreen = ({ navigation, route }) => {
  const videoPlayer = React.useRef();
  const url = route.params.url;
  const [currentTime, setCurrentTime] = React.useState(0);
  const [currentTimeTrimmer, setCurrentTimeTrimmer] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState();
  const [play, setPlay] = React.useState(false);
  const [replay, setReplay] = React.useState(false);
  const [fps, setFPS] = React.useState(8);

  React.useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current
        .getVideoInfo()
        .then((r) => {
          console.log(r);
          setEndTime(r.duration);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  const onVideoChange = ({ nativeEvent }) => {
    setCurrentTimeTrimmer(nativeEvent.currentTime);
  };

  const onTrackerMove = ({ currentTime }) => {
    setPlay(false);
    setReplay(false);
    setCurrentTime(currentTime);
    // setCurrentTimeTrimmer(currentTime);
  };

  const onTrimmerChange = (e) => {
    // setCurrentTimeTrimmer(0);
    setPlay(false);
    setReplay(false);
    if (e.startTime !== startTime) {
      setCurrentTime(e.startTime);
    }
    if (e.endTime !== endTime) {
      setCurrentTime(e.endTime);
    }
    setStartTime(e.startTime);
    setEndTime(e.endTime);
  };

  const toggleVideo = () => {
    setPlay(!play);
    setReplay(!replay);
  };

  const changeFPS = (fps) => {
    setFPS(fps);
  };
  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.titleContainer}>
          <Button appearance="ghost" onPress={() => navigation.goBack()}>
            <Text>Cancel</Text>
          </Button>
          <Button appearance="ghost">
            <Text status="info">Next</Text>
          </Button>
        </Layout>

        <Layout style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Text>{Math.round(startTime)}</Text>
          <Text>-</Text>
          <Text>{Math.round(endTime)}</Text>
        </Layout>

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
          onPress={toggleVideo}>
          {!play && (
            <Button appearance="ghost" style={styles.pauseButton} onPress={toggleVideo}>
              <Icon name="play-circle-outline" fill="#fff" style={styles.playButton} />
            </Button>
          )}
          {play && <Button appearance="ghost" style={styles.pauseButton} onPress={toggleVideo} />}
        </VideoPlayer>

        <Layout style={{ position: 'absolute', bottom: '25%' }}>
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
            height={80}
            width={screenWidth}
            onTrackerMove={onTrackerMove} // iOS only
            currentTime={play ? currentTimeTrimmer : undefined} // use this prop to set tracker position iOS only
            themeColor="#C3070B" // iOS only
            // thumbWidth={30} // iOS only
            trackerColor="#C3070B" // iOS only
            onChange={onTrimmerChange}
            trackerHandleColor="#C3070B"
            minLength={1}
            showTrackerHandle={true}
            // maxLength={10}
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
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  image: { width: '100%', height: 210, backgroundColor: '#000' },
  playButton: {
    width: 80,
    height: 80,
  },
  pauseButton: {
    width: screenWidth,
    height: '100%',
    height: 230,
    position: 'absolute',
    opacity: 1,
    // top: 145,
    top: 165,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: '42%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
});
