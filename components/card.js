import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { TagList } from './tagList';
import { PostMenu } from './postMenu';

export const Card = ({ item, navigateDetail }) => {
  const tags = item.tags;
  const title = item.title;

  const goToDetail = () => {
    navigateDetail(item, title, tags);
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
      <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="contain" />
      <TagList tags={tags} style={styles.tagContainer} level="1" />
      <Layout style={styles.buttonContainer}>
        <Text appearance="hint" category="c1" style={{ marginLeft: 6, lineHeight: 16 }}>
          {`${getRelativeTime(item.created_at * 1000)}\nPosted by ${item.author}`}
        </Text>
        <PostMenu item={item} sizeStar="medium" sizeMore="medium" />
      </Layout>
      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // minHeight: 390,
  },
  image: {
    width: '100%',
    height: 210,
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
