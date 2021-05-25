import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { PostMenu } from './postMenu';

export const CardSmall = ({ item, deleteAlert, navigateDetail }) => {
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
      <Layout style={styles.infoContainer}>
        <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="cover" />
        <Layout style={styles.tagContainer}>
          <Text category="s1" style={{ marginBottom: 6 }} numberOfLines={1}>
            {title}
          </Text>
          <Layout style={{ justifyContent: 'space-between', height: 90 }}>
            <Text style={{ width: '95%' }} numberOfLines={5}>
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
              <PostMenu item={item} deleteAlert={deleteAlert} />
            </Layout>
          </Layout>
        </Layout>
      </Layout>

      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 132,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  image: {
    width: '40%',
    height: 115,
    marginRight: 8,
  },
  tagContainer: { width: '60%' },
  tagRow: {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagLimit: {
    maxWidth: 120,
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: 5,
    paddingLeft: 0,
  },
});
