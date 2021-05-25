import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';
import { getPosts } from '../api/post';
import { useQuery, useInfiniteQuery } from 'react-query';
import { Layout, Text } from '@ui-kitten/components';

const Loader = (props) => <Icon {...props} name="loader-outline" />;

export const PostVerticalList = ({ search = '', layoutType, deleteAlert, navigateDetail, fromSearch = false }) => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({ posts: [], tags: {} });
  const [isFetching, setFetching] = useState(false);
  const [message, setMessage] = useState('Nobody here but us chickens!');

  const fetchPost = async (page, isFirst) => {
    if (!isFirst) setFetching(true);
    const response = await getPosts({ search, page, include_tags: 1 });
    const filteredPosts = response.posts.filter((p) => !data.posts.some((currentPost) => currentPost.id === p.id));
    let newData = { posts: [...data.posts, ...filteredPosts], tags: { ...data.tags, ...response.tags } };
    if (page === 1) newData = response;
    setData(newData);
    setLoading(false);
    setFetching(false);
  };

  useEffect(() => {
    if (!fromSearch) {
      fetchPost(page, true);
    } else {
      setMessage('');
      setLoading(false);
    }
  }, []);

  const renderItem = ({ item }) =>
    layoutType === 'small' ? (
      <CardSmall
        key={item.id.toString()}
        item={item}
        tagsWithType={data.tags}
        deleteAlert={deleteAlert}
        navigateDetail={navigateDetail}
      />
    ) : (
      <Card
        key={item.id.toString()}
        item={item}
        tagsWithType={data.tags}
        deleteAlert={deleteAlert}
        navigateDetail={navigateDetail}
      />
    );

  const onEndReached = async () => {
    if (!isLoading && !isFetching) {
      fetchPost(page + 1);
      setPage(page + 1);
    }
  };

  const refetch = () => {
    if (!isLoading && !isFetching) {
      fetchPost(1);
      setPage(1);
    }
  };

  if (isLoading)
    return (
      <Layout style={styles.center}>
        <ActivityIndicator />
      </Layout>
    );

  return (
    <FlatList
      data={data.posts}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: 10,
      }}
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
      onEndReachedThreshold={4}
      onEndReached={onEndReached}
      ListFooterComponent={
        isFetching &&
        !isLoading && (
          <Layout style={styles.center}>
            <ActivityIndicator />
          </Layout>
        )
      }
      ListEmptyComponent={
        !isFetching && (
          <Layout style={styles.center}>
            <Text>{message}</Text>
          </Layout>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});
