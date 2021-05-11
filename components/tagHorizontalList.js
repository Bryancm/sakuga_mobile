import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { SmallCard } from '../components/uploadCard';
import { Tag } from '../components/tag';
import { ScrollView } from 'react-native-gesture-handler';

export const TagHorizontalList = ({ title, data, navigation }) => {
  const renderItem = ({ item }) => <Tag tag={item} />;
  const keyStractor = (item) => item.id.toString();
  const navigatePostList = () => {
    navigation.navigate('PostList', { from: title });
  };
  const halfIndex = Math.round((data.length - 1) / 2);

  return (
    <Layout>
      <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text category="h4" style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
          {title}
        </Text>
        <Button style={{ width: 100, paddingRight: 0 }} appearance="ghost" onPress={navigatePostList}>
          <Text category="p2">See more</Text>
        </Button>
      </Layout>
      <ScrollView horizontal>
        <FlatList
          numColumns={halfIndex}
          data={data}
          renderItem={renderItem}
          keyStractor={keyStractor}
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

const styles = StyleSheet.create({
  container: {},
});
