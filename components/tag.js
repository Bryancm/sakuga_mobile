import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';
import {getTagStyle} from '../util/api';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const screenWidth = Dimensions.get('window').width;

export const Tag = ({tag}) => {
  const style = getTagStyle(tag.type);
  return (
    <Layout style={{...style, ...styles.container}}>
      <Text style={{color: style.color}} numberOfLines={1}>
        {tag.name}
      </Text>
      <Icon
        fill={style.color}
        name="play-circle-outline"
        style={{width: 15, height: 15, marginLeft: 10}}
      />
      <Text style={{color: style.color, marginLeft: 2}} numberOfLines={1}>
        {tag.count}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
});
