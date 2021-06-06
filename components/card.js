import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Divider, Layout, Text, Icon } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { TagList } from './tagList';
import { PostMenu } from './postMenu';
import VideoPlayer from 'react-native-video';
import converProxyUrl from 'react-native-video-cache';

const ImageIcon = (props) => <Icon {...props} name="image-outline" />;
const screenHeight = Dimensions.get('window').width;
// const videoHeight = Math.round(screenHeight * 0.26 - 1);
const videoHeight = Math.round(screenHeight * 0.57);

export const Card = forwardRef((props, ref) => {
  const { item, navigateDetail, autoPlay } = props;
  const tags = item.tags;
  const title = item.title;
  const isVideo =
    item.file_ext !== 'gif' && item.file_ext !== 'jpg' && item.file_ext !== 'jpeg' && item.file_ext !== 'png';
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    playVideo() {
      setPaused(false);
    },
    pauseVideo() {
      setPaused(true);
    },
  }));

  const goToDetail = () => {
    setPaused(true);
    navigateDetail(item, title, tags);
  };

  const onLoad = () => setLoading(false);
  const onLoadStart = () => setLoading(true);
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
        {loading && autoPlay && (
          <Layout style={styles.loaderContainer}>
            <ActivityIndicator color="#D4D4D4" />
          </Layout>
        )}
        {!isVideo && (
          <Layout style={styles.loaderContainer}>
            <ImageIcon style={{ width: 20, height: 20 }} fill="#fff" />
          </Layout>
        )}
        <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="contain" />
        {isVideo && !paused && autoPlay && (
          <VideoPlayer
            paused={paused}
            repeat={true}
            muted={true}
            source={{ uri: converProxyUrl(item.file_url) }}
            // poster={item.preview_url}
            style={styles.image}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            resizeMode="contain"
          />
        )}
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
    right: 4,
    bottom: 4,
    zIndex: 6,
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
