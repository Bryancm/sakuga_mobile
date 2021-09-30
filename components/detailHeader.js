import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import ParsedText from 'react-native-parsed-text';
import { ProcessingManager } from 'react-native-video-processing';
import { RNFFprobe } from 'react-native-ffmpeg';

const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const EditIcon = (props) => <Icon {...props} name="edit-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const round = (value, exp) => {
  if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] + exp : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp));
};

export const DetailHeader = React.memo(
  ({ title, style, url, setPaused, file_ext, id, isVideo, item, setItem, setTags }) => {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [frameRate, setFrameRate] = React.useState('');

    React.useEffect(() => {
      if (!frameRate) getFrameRate();
    }, []);

    const getFrameRate = async () => {
      if (!frameRate) {
        try {
          await RNFFprobe.getMediaInformation(url)
            .then((info) => {
              const allProperties = info.getAllProperties();
              const splitFrameRate = allProperties.streams[0].avg_frame_rate.split('/');
              const frameRate = splitFrameRate[0] / splitFrameRate[1];
              setFrameRate(round(frameRate, 6));
            })
            .catch((e) => console.log('MEDIA_INFO_FRAMERATE_ERROR: ', e));
          // const { frameRate } = await ProcessingManager.getVideoInfo(url);
        } catch (error) {
          console.log('GET_FRAME_RATE_ERROR: ', error);
        }
      }
    };

    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };
    const navigation = useNavigation();

    const navigateGifEditor = () => {
      setPaused(true);
      toggleMenu();
      navigation.navigate('GifEditor', { url, title, file_ext, id });
    };

    const navigateFramesEditor = () => {
      setPaused(true);
      toggleMenu();
      navigation.navigate('FramesEditor', { url, title, file_ext, id });
    };

    const navigateEditPost = () => {
      setPaused(true);
      toggleMenu();
      navigation.navigate('EditPost', { item, setItem, updateCurrentTags: setTags });
    };

    const menuAnchor = () => (
      <Button
        style={{ paddingHorizontal: 0, paddingTop: 16 }}
        status="basic"
        appearance="ghost"
        accessoryRight={OptionsIcon}
        onPress={toggleMenu}
      />
    );

    const urlPress = (url) => {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) return console.log("Don't know how to open URI: " + url);
        Linking.openURL(url);
      });
    };

    const textToParse = () => {
      const source = item.source ? `Source: ${item.source} ` : '';
      const size = `Size: ${item.width}x${item.height} `;
      const fps = frameRate ? `${frameRate} fps` : '';
      return source + size + fps;
    };

    return (
      <Layout level="2" style={style}>
        <Layout level="2" style={{ paddingVertical: 14, width: '90%' }}>
          <Text category="h6">{title}</Text>
          <Layout level="2" style={{ flexDirection: 'row' }}>
            <ParsedText style={styles.text} parse={[{ type: 'url', style: styles.url, onPress: urlPress }]}>
              {textToParse()}
            </ParsedText>
          </Layout>
        </Layout>

        <Layout level="2" style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-start' }}>
          <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
            {isVideo && file_ext !== 'webm' && (
              <MenuItem
                key="1"
                onPress={navigateFramesEditor}
                title={<Text category="c1">Frames</Text>}
                accessoryLeft={GridIcon}
              />
            )}
            {isVideo && file_ext !== 'webm' && (
              <MenuItem
                key="2"
                onPress={navigateGifEditor}
                title={<Text category="c1">GIF</Text>}
                accessoryLeft={ImageIcon}
              />
            )}
            <MenuItem
              key="3"
              onPress={navigateEditPost}
              title={<Text category="c1">Edit</Text>}
              accessoryLeft={EditIcon}
            />
          </OverflowMenu>
        </Layout>
      </Layout>
    );
  },
);

const styles = StyleSheet.create({
  url: { color: '#2980b9' },
  text: { fontSize: 12, color: '#808080', width: '100%' },
});
