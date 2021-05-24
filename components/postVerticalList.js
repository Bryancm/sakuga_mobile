import React from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';
import { getPosts } from '../api/post';
import { useQuery, useInfiniteQuery } from 'react-query';
import { Layout, Text } from '@ui-kitten/components';

const Loader = (props) => <Icon {...props} name="loader-outline" />;

export const PostVerticalList = ({ tags = '', layoutType, deleteAlert, navigateDetail }) => {
  const [page, setPage] = React.useState(1);
  const { isLoading, data, isFetching, refetch, fetchNextPage } = useInfiniteQuery(
    'posts',
    ({ pageParam }) => getPosts({ tags, include_tags: 1, pageParam }),
    {
      keepPreviousData: true,
      staleTime: 3600000,
      notifyOnChangePropsExclusions: ['isStale'],
      select: (data) => {
        var posts = [];
        var tags = {};
        for (const d of data.pages) {
          posts = [...posts, ...d.posts];
          tags = { ...tags, ...d.tags };
        }
        return { posts, tags };
      },
    },
  );
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
    await fetchNextPage({ pageParam: page + 1 });
    setPage(page + 1);
  };

  // console.log('QUERY_LOADING: ', isLoading);
  // console.log('QUERY_IS_ERROR: ', isError);
  // console.log('QUERY_ERROR: ', error);
  // if (data) console.log('QUERY_DATA: ', data);
  // console.log('QUERY_FETCHING: ', isFetching);
  // console.log('QUERY_PREV_DATA', isPreviousData);
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
      // windowSize={10}
      // initialNumToRender={10}
      // maxToRenderPerBatch={10}
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
      // onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      ListFooterComponent={
        isFetching && (
          <Layout style={styles.center}>
            <ActivityIndicator />
          </Layout>
        )
      }
      ListEmptyComponent={
        !isFetching && (
          <Layout style={styles.center}>
            <Text>Nobody here but us chickens!</Text>
          </Layout>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 140 },
});
