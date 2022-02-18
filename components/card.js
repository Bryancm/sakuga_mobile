import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Divider, Layout, Text, Icon } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { TagList } from './tagList';
import { PostMenu } from './postMenu';
import VideoPlayer from 'react-native-video';
import converProxyUrl from 'react-native-video-cache';
import { verticalScale } from 'react-native-size-matters';

const ImageIcon = (props) => <Icon {...props} name="image-outline" />;
const videoHeight = Platform.isPad ? verticalScale(233) : 233;

export const Card = forwardRef((props, ref) => {
  const { item, navigateDetail, autoPlay } = props;
  const tags = item.tags;
  const title = item.title;
  const isVideo =
    item.file_ext !== 'gif' && item.file_ext !== 'jpg' && item.file_ext !== 'jpeg' && item.file_ext !== 'png';
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hideImage, setHideImage] = useState(false);

  useImperativeHandle(ref, () => ({
    playVideo() {
      setPaused(false);
    },
    pauseVideo() {
      setHideImage(false);
      setPaused(true);
    },
  }));

  const goToDetail = () => {
    setPaused(true);
    navigateDetail(item, title, tags);
  };

  const onReadyForDisplay = () => {
    setHideImage(true);
    setLoading(false);
  };
  const onLoadStart = () => setLoading(true);
  const onError = (e) => {
    console.log('VIDEO_ERROR_CARD_NAME: ', title);
    console.log('VIDEO_ERROR_CARD: ', e);
    setError(true);
  };

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={styles.container}
      onPress={goToDetail}>
      <Text style={{ paddingHorizontal: 8, paddingVertical: 15 }} category="h6" numberOfLines={1}>
        {title}
      </Text>
      <Layout style={styles.imageContainer}>
        {loading && autoPlay && !error && (
          <Layout style={styles.loaderContainer}>
            <ActivityIndicator color="#D4D4D4" />
          </Layout>
        )}

        {isVideo && !paused && autoPlay && (
          <VideoPlayer
            paused={paused}
            repeat={true}
            muted={true}
            source={{ uri: converProxyUrl(item.file_url) }}
            style={styles.image}
            onReadyForDisplay={onReadyForDisplay}
            onLoadStart={onLoadStart}
            resizeMode="contain"
            onError={onError}
            bufferConfig={{
              minBufferMs: 20000,
              maxBufferMs: 90000,
              bufferForPlaybackMs: 100,
              bufferForPlaybackAfterRebufferMs: 500,
            }}
          />
        )}
        {!hideImage && <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="contain" />}
      </Layout>

      <TagList tags={tags} style={styles.tagContainer} level="1" setPaused={setPaused} />
      <Layout style={styles.buttonContainer}>
        <Text appearance="hint" category="c1" style={{ marginLeft: 6, lineHeight: 16 }}>
          {`${getRelativeTime(item.created_at * 1000)}\nPosted by ${item.author}`}
        </Text>
        <PostMenu item={item} sizeStar="medium" sizeMore="medium" />
      </Layout>
      <Divider />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  loaderContainer: {
    padding: 2,
    borderRadius: 15,
    opacity: 0.8,
    position: 'absolute',
    right: 2,
    bottom: 2,
    zIndex: 15,
  },
  imageContainer: {
    width: '100%',
    height: videoHeight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 5,
  },
  tagContainer: {
    paddingLeft: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagLimit: {
    borderRadius: 13,
  },
});
