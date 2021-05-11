import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';
import {SmallCard} from '../components/uploadCard';

export const PostHorizontalList = ({title, data, navigation}) => {
  const renderItem = ({item}) => (
    <SmallCard item={item} tagsWithType={data.tags} />
  );
  const keyStractor = (item) => item.id.toString();
  const navigatePostList = () => {
    navigation.navigate('PostList', {from: title});
  };
  return (
    <Layout>
      <Layout style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text category="h4" style={{paddingHorizontal: 5, paddingVertical: 15}}>
          {title}
        </Text>
        <Button
          style={{width: 100, paddingRight: 0}}
          appearance="ghost"
          onPress={navigatePostList}>
          <Text category="p2">See more</Text>
        </Button>
      </Layout>

      <FlatList
        horizontal
        data={data.post}
        renderItem={renderItem}
        keyStractor={keyStractor}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {},
});
