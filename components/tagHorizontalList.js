import React from 'react';
import { FlatList } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { Tag } from '../components/tag';
import { ScrollView } from 'react-native-gesture-handler';

export const TagHorizontalList = ({ title, data, navigation, menuType }) => {
  const renderItem = ({ item }) => <Tag key={item.id.toString()} tag={item} navigatePostList={navigatePostList} />;
  const navigatePostList = (from, data, isPosts, menuType) => {
    navigation.navigate('PostList', { from, data, isPosts, menuType });
  };
  const halfIndex = Math.round((data.length - 1) / 2);

  return (
    <Layout>
      <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text category="h4" style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
          {title}
        </Text>
        <Button
          style={{ width: 100, paddingRight: 0 }}
          appearance="ghost"
          onPress={() => navigatePostList(title, data, false, menuType)}>
          <Text category="p2">See more</Text>
        </Button>
      </Layout>
      <ScrollView horizontal>
        <FlatList
          bounces={false}
          numColumns={halfIndex}
          data={data}
          renderItem={renderItem}
          windowSize={10}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          columnWrapperStyle={{ marginBottom: 14 }}
          contentContainerStyle={{
            paddingHorizontal: 5,
          }}
        />
      </ScrollView>
    </Layout>
  );
};
