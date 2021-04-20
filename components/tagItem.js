import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';
import {getTagStyle} from '../util/api';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const screenWidth = Dimensions.get('window').width;
const max_width = screenWidth * 0.47;

export const Tag = ({tag}) => {
  const style = getTagStyle(tag.type);
  return (
    <Layout style={{...style, ...styles.container}}>
      <Text
        category="c2"
        style={{color: style.color, maxWidth: max_width - 52}}
        // ellipsizeMode="clip"
        numberOfLines={1}>
        {tag.name}
      </Text>
      <Icon
        fill={style.color}
        name="play-circle-outline"
        style={{width: 15, height: 15, marginLeft: 8}}
      />
      <Text
        category="c2"
        style={{color: style.color, marginLeft: 2}}
        numberOfLines={1}>
        {tag.count}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
    maxWidth: max_width,
    paddingHorizontal: 15,
  },
});
