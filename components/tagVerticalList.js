import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { getTags } from '../api/tag';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Tag } from '../components/tagItem';

export const TagVerticalList = ({ search = '', focus, order, type }) => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isRefetching, setRefetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

  const fetchTags = async (page, isFirst, search, order, type) => {
    try {
      if (!isFirst) setFetching(true);
      const response = await getTags({ name: search, page, order, type });
      if (response.length === 0) setHasMore(false);
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

  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.push('PostList', { from, isPosts, menuType, search, order, type });
  };

  const clearLoading = () => {
    setLoading(false);
    setFetching(false);
    setRefetching(false);
  };

  const renderItem = ({ item }) => <Tag tag={item} navigatePostList={navigatePostList} />;

  const onEndReached = useCallback(async () => {
    if (!isLoading && !isFetching && hasMore) {
      fetchTags(page + 1, false, search, order, type);
      setPage(page + 1);
    }
  }, [isLoading, isFetching, page, hasMore]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const refetch = useCallback(() => {
    if (!isLoading && !isFetching && !isRefetching) {
      setRefetching(true);
      fetchTags(1, true, search, order, type);
      setPage(1);
    }
  }, [isLoading, isFetching, isRefetching]);

  if (focus) return <Layout style={{ ...styles.center, height: '100%' }} />;
  if (isLoading)
    return (
      <Layout style={{ ...styles.center, height: '100%' }}>
        <ActivityIndicator />
      </Layout>
    );

  return (
    <FlatList
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
      data={data}
      renderItem={renderItem}
      onEndReachedThreshold={1}
      onEndReached={onEndReached}
      keyExtractor={keyExtractor}
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefetching} />}
      ListFooterComponent={
        <Layout style={styles.center}>{isFetching && !isRefetching && <ActivityIndicator />}</Layout>
      }
      ListEmptyComponent={
        !isFetching && (
          <Layout style={{ ...styles.center, height: '100%' }}>
            <Text>{message}</Text>
          </Layout>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  center: { alignItems: 'center', justifyContent: 'center', height: 132, width: '100%' },
});
