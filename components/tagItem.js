import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

export const Tag = ({ tag, navigatePostList }) => {
  const style = getTagStyle(tag.type);
  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={{ ...style, ...styles.container, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 18 }}
      onPress={() => navigatePostList(tag.name, true, 'post', tag.name, 'date', tag.type)}>
      <Text
        category={Platform.isPad ? 'p1' : 'c2'}
        style={{ color: style.color, maxWidth: Platform.isPad ? 150 : 130 }}
        numberOfLines={1}>
        {tag.name}
      </Text>
      <Icon
        fill={style.color}
        name="play-circle-outline"
        style={{
          width: Platform.isPad ? 16 : 13,
          height: Platform.isPad ? 16 : 13,
          marginLeft: Platform.isPad ? 4 : 2,
        }}
      />
      <Text
        category={Platform.isPad ? 'p1' : 'c2'}
        style={{ color: style.color, marginLeft: Platform.isPad ? 4 : 2 }}
        numberOfLines={1}>
        {tag.count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.isPad ? 24 : 16,
    marginRight: Platform.isPad ? 24 : 16,
  },
});
