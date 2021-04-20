import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const screenWidth = Dimensions.get('window').width;

export const Card = ({item}) => {
  const tags = item.tags.split(' ');
  const more_tags = tags.length - 2;

  return (
    <Layout style={styles.container}>
      <Image style={styles.image} source={{uri: item.preview_url}} />
      <Layout style={styles.tagContainer}>
        <Layout style={styles.tagRow}>
          {tags && tags[0] && (
            <Text
              style={styles.tag}
              status="basic"
              category="c1"
              numberOfLines={1}>
              {tags[0].name ? tags[0].name : tags[0]}
            </Text>
          )}
          <Text status="primary">-</Text>
          {tags && tags[1] && (
            <Text
              style={styles.tag}
              status="basic"
              category="c1"
              numberOfLines={1}>
              {tags[1].name ? tags[1].name : tags[1]}
            </Text>
          )}
        </Layout>
        <Layout style={{...styles.tagRow, justifyContent: 'flex-start'}}>
          {tags && tags[2] && (
            <Text
              style={styles.tag}
              status="basic"
              category="c1"
              numberOfLines={1}>
              {tags[2].name ? tags[2].name : tags[2]}
            </Text>
          )}
          <Text style={{marginHorizontal: 5}} status="primary">
            -
          </Text>

          {more_tags > 0 && (
            <Text key="0" status="basic" category="c1">
              {`+ ${more_tags}`}
            </Text>
          )}
        </Layout>
        <Layout
          style={{
            ...styles.tagRow,
            marginTop: 5,
            justifyContent: 'flex-start',
          }}>
          <Icon
            fill="#D4D4D4"
            name="star-outline"
            style={{width: 15, height: 15, marginRight: 5}}
          />
          <Text status="basic" category="c1">
            {item.score}
          </Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.35,
    marginRight: 30,
  },
  image: {
    width: '100%',
    height: 160,
  },
  tagContainer: {paddingHorizontal: 5, paddingVertical: 15},
  tagRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    maxWidth: 50,
  },
});
