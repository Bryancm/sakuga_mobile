import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { Tag } from '../components/tag';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { getTags } from '../api/tag';

export const TagHorizontalList = ({ title, menuType, search = '', order, type }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

  const fetchTags = async (page, isFirst, search, order, type) => {
    try {
      if (!isFirst) setFetching(true);
      const response = await getTags({ name: search, page, order, type, limit: 30 });
      const filteredTags = response.filter((t) => !data.some((currentTag) => currentTag.id === t.id));
      let newData = [...data, ...filteredTags];
      if (page === 1) newData = filteredTags;
      if (!message || message === 'Error, please try again later :(') setMessage('Nobody here but us chickens!');
      setData(newData);
      clearLoading();
    } catch (error) {
      console.log('FETCH_POST_ERROR: ', error);
      setData([]);
      setMessage('Error, please try again later :(');
      clearLoading();
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTags(1, true, search, order, type);
  }, [search, order, type]);

  const clearLoading = () => {
    setLoading(false);
  };

  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.navigate('PostList', { from, isPosts, menuType, search, order, type });
  };

  const renderItem = ({ item }) => <Tag key={item.id.toString()} tag={item} navigatePostList={navigatePostList} />;

  return (
    <Layout>
      <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text category="h4" style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
          {title}
        </Text>
        <Button
          style={{ width: 100, paddingRight: 0 }}
          appearance="ghost"
          onPress={() => navigatePostList(title, false, menuType, search, order, type)}>
          <Text category="p2">See more</Text>
        </Button>
      </Layout>
      {isLoading ? (
        <Layout style={styles.center}>
          <ActivityIndicator />
        </Layout>
      ) : (
        <ScrollView horizontal>
          <FlatList
            bounces={false}
            numColumns={15}
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
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', height: 88, width: '100%' },
});
