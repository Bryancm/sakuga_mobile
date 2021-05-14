import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Icon } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

export const Tag = ({ tag }) => {
  const style = getTagStyle(tag.type);
  return (
    <Layout style={{ ...style, ...styles.container }}>
      <Text category="c2" style={{ color: style.color, maxWidth: 125 }} numberOfLines={1}>
        {tag.name}
      </Text>
      <Icon fill={style.color} name="play-circle-outline" style={{ width: 15, height: 15, marginLeft: 6 }} />
      <Text category="c2" style={{ color: style.color, marginLeft: 2 }} numberOfLines={1}>
        {tag.count}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 16,
  },
});
