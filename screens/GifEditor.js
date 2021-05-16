import React from 'react';
import { SafeAreaView, Image, StyleSheet, Keyboard, Dimensions } from 'react-native';
import { Divider, Icon, Layout, Input, Button, Text } from '@ui-kitten/components';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const SendIcon = (props) => <Icon {...props} name="corner-down-right-outline" />;
const screenWidth = Dimensions.get('window').width;

export const GifEditorScreen = ({ navigation, route }) => {
  const videoPlayer = React.useRef();
  const url = route.params.url;
  const [currentTime, setCurrentTime] = React.useState(0);

  const onVideoChange = ({ nativeEvent }) => {
    setCurrentTime(nativeEvent.currentTime);
  };
  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.titleContainer}>
          <Button appearance="ghost" onPress={() => navigation.goBack()}>
            <Text>Cancel</Text>
          </Button>
          <Button appearance="ghost">
            <Text status="info">Done</Text>
          </Button>
        </Layout>
        <VideoPlayer
          ref={videoPlayer}
          //   startTime={0} // seconds
          //   endTime={120} // seconds
          play={true} // default false
          replay={true} // should player play video again if it's ended
          //   rotate={true} // use this prop to rotate video if it captured in landscape mode iOS only
          source={url}
          //   playerWidth={300} // iOS only
          //   playerHeight={500} // iOS only
          style={{ backgroundColor: 'black' }}
          resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
          onChange={onVideoChange} // get Current time on every second
        />
        <Trimmer
          source={url}
          height={60}
          width={screenWidth}
          onTrackerMove={(e) => console.log(e.currentTime)} // iOS only
          currentTime={currentTime} // use this prop to set tracker position iOS only
          themeColor={'white'} // iOS only
          thumbWidth={20} // iOS only
          trackerColor={'blue'} // iOS only
          onChange={(e) => console.log(e.startTime, e.endTime)}
        />
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
});
