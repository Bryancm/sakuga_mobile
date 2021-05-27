import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { PostMenu } from './postMenu';

export const SmallCard = ({ item, navigateDetail }) => {
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
      <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="cover" />
      <Layout style={styles.tagContainer}>
        <Text category="c2" style={{ marginBottom: 6 }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ height: 70, lineHeight: 16 }} numberOfLines={4}>
          {tags.length > 0 &&
            tags.map((t, i) =>
              t.style ? (
                <Text key={i} category="c1" style={{ color: t.style.color }}>
                  {`${t.tag ? t.tag : t} `}
                </Text>
              ) : (
                <Text key={i} category="c1">
                  {`${t.tag ? t.tag : t} `}
                </Text>
              ),
            )}
        </Text>
        <Layout style={styles.buttonContainer}>
          <Text appearance="hint" category="c1">
            {getRelativeTime(item.created_at * 1000)}
          </Text>

          <PostMenu
            item={item}
            menuStyle={{ paddingHorizontal: 0, paddingVertical: 0, width: 20, marginRight: 3 }}
            menuStyle2={{ paddingRight: 0, paddingVertical: 0, width: 20, paddingLeft: 24 }}
          />
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    paddingHorizontal: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  image: {
    height: 115,
    marginBottom: 5,
  },
  tagContainer: {},
  tagRow: {
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // alignSelf: 'flex-end',
  },
  tagLimit: {
    maxWidth: 92,
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: 5,
    paddingLeft: 0,
  },
});
