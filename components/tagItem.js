import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

export const Tag = ({ tag, navigatePostList }) => {
  const style = getTagStyle(tag.type);
  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={{ ...style, ...styles.container }}
      onPress={() => navigatePostList(tag.name, true, 'post', tag.name, 'date', tag.type)}>
      <Text category="c2" style={{ color: style.color, maxWidth: 130 }} numberOfLines={1}>
        {tag.name}
      </Text>
      <Icon fill={style.color} name="play-circle-outline" style={{ width: 13, height: 13, marginLeft: 2 }} />
      <Text category="c2" style={{ color: style.color, marginLeft: 2 }} numberOfLines={1}>
        {tag.count}
      </Text>
    </TouchableOpacity>
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
