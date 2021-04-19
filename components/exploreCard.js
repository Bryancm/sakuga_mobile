import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';

// const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const screenWidth = Dimensions.get('window').width;

export const Card = ({item}) => {
  const tags = item.tags.split(' ');
  const more_tags = tags.length - 2;

  return (
    <Layout style={styles.container}>
      <Image
        style={styles.image}
        source={{uri: item.preview_url}}
        resizeMode="stretch"
      />
      <Layout style={styles.tagContainer}>
        <Layout style={styles.tagRow}>
          {/* <Button
            style={{padding: 5}}
            size="tiny"
            appearance="ghost"
            accessoryLeft={StarIcon}>
            <Text status="primary" category="c1">
              {item.score}
            </Text>
          </Button> */}
          {tags.length > 0 &&
            tags.map(
              (t, i) =>
                i < 3 && (
                  <Text
                    style={styles.tag}
                    key={i}
                    status="basic"
                    category="c1"
                    numberOfLines={1}>
                    {t.name ? t.name : t}
                  </Text>
                ),
            )}
          {more_tags > 0 && (
            <Text key="0" status="basic" category="c1" style={styles.tag}>
              {`+ ${more_tags}`}
            </Text>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.75,
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
    borderWidth: 0.5,
    borderColor: '#F5F5F5',
    borderRadius: 11,
    paddingVertical: 3,
    paddingHorizontal: 6,
    maxWidth: 80,
  },
});
