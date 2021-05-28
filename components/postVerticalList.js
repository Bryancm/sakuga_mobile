import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';
import { getPosts } from '../api/post';
import { Layout, Text } from '@ui-kitten/components';
import { tagStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const PostVerticalList = ({ search = '', layoutType, deleteAlert, fromSearch, focus }) => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isRefetching, setRefetching] = useState(false);
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

  const navigateDetail = (item, title, tags) => {
    navigation.navigate('Detail', { item, title, tags });
  };

  const postWithDetails = (tagsWithType, post) => {
    var artist = '';
    var copyright = '';
    var tags = [];
    for (const tag in tagsWithType) {
      if (Object.hasOwnProperty.call(tagsWithType, tag)) {
        const type = tagsWithType[tag];
        if (post.tags.includes(tag)) {
          var style = tagStyles.artist_outline;
          if (type === 'artist') artist = artist + ' ' + capitalize(tag);
          if (type === 'copyright') {
            style = tagStyles.copyright_outline;
            copyright = tag;
          }
          if (type === 'terminology') style = tagStyles.terminology_outline;
          if (type === 'meta') style = tagStyles.meta_outline;
          if (type === 'general') style = tagStyles.general_outline;
          tags.push({ type, tag, style });
        }
      }
    }
    const name =
      artist.trim() && artist.trim() !== 'Artist_unknown'
        ? artist.replace('Artist_unknown', '').trim()
        : copyright.trim();
    const title = capitalize(name).replaceAll('_', ' ');

    tags.sort((a, b) => a.type > b.type);
    post.tags = tags;
    post.title = title;
    return post;
  };

  const fetchPost = async (page, isFirst, search) => {
    try {
      if (!isFirst) setFetching(true);
      const response = await getPosts({ search, page, include_tags: 1 });
      const postsWithTitle = response.posts.map((p) => postWithDetails(response.tags, p));
      const filteredPosts = postsWithTitle.filter((p) => !data.some((currentPost) => currentPost.id === p.id));
      let newData = [...data, ...filteredPosts];
      if (page === 1) newData = postsWithTitle;
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

  const clearLoading = () => {
    setLoading(false);
    setFetching(false);
    setRefetching(false);
  };

  useEffect(() => {
    if (search) setLoading(true);
    if (search) fetchPost(1, true, search);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [layoutType]);

  useEffect(() => {
    if (fromSearch) {
      clearLoading();
    } else {
      if (!search) fetchPost(page, true);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) =>
      layoutType === 'small' ? (
        <CardSmall item={item} deleteAlert={deleteAlert} navigateDetail={navigateDetail} />
      ) : (
        <Card item={item} deleteAlert={deleteAlert} navigateDetail={navigateDetail} />
      ),
    [layoutType],
  );

  const onEndReached = useCallback(async () => {
    if (!isLoading && !isFetching) {
      fetchPost(page + 1, false, search);
      setPage(page + 1);
    }
  }, [isLoading, isFetching, page]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const refetch = useCallback(() => {
    if (!isLoading && !isFetching && !isRefetching) {
      setRefetching(true);
      fetchPost(1, true, search);
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
      data={data}
      renderItem={renderItem}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={16}
      // updateCellsBatchingPeriod={150}
      onEndReachedThreshold={1}
      viewabilityConfig={{
        minimumViewTime: 200,
        viewAreaCoveragePercentThreshold: 100,
      }}
      contentContainerStyle={{
        paddingBottom: 10,
      }}
      // getItemLayout={getItemLayout}
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
  center: { alignItems: 'center', justifyContent: 'center', height: 132, width: '100%' },
});
