import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet, Alert, Dimensions } from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';
import { getPosts } from '../api/post';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { tagStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import { getData, storeData, removeData } from '../util/storage';
import Toast from 'react-native-simple-toast';

const UmbrellaIcon = (props) => <Icon {...props} name="umbrella-outline" />;
const screenHeight = Dimensions.get('window').height;

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const PostVerticalList = ({
  search = '',
  layoutType,
  showDeleteButton,
  focus,
  from,
  setRemoveAll,
  autoPlay,
}) => {
  let cellRefs = {};
  let viewableIndex = 0;
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isRefetching, setRefetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (cellRefs && cellRefs[viewableIndex]) cellRefs[viewableIndex].playVideo();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (cellRefs && cellRefs[viewableIndex]) cellRefs[viewableIndex].pauseVideo();
    });
    return unsubscribe;
  }, [navigation]);

  const navigateDetail = (item, title, tags) => {
    navigation.push('Detail', { item, title, tags });
  };

  const postWithDetails = (tagsWithType, post, votes) => {
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
    const title = name ? capitalize(name).replace(/_/g, ' ') : name;

    var userScore = 0;
    for (const post_id in votes) {
      if (Object.hasOwnProperty.call(votes, post_id)) {
        const vote = votes[post_id];
        if (Number(post_id) === post.id) userScore = vote;
      }
    }

    tags.sort((a, b) => a.type > b.type);
    post.userScore = userScore;
    post.tags = tags;
    post.title = title;
    return post;
  };

  const fetchPost = async (page, isFirst, search) => {
    try {
      if (!isFirst) setFetching(true);
      var params = { search, page, include_tags: 1, include_votes: 1 };
      const user = await getData('user');
      if (user) params = { ...params, user: user.name, password_hash: user.password_hash };
      const response = await getPosts(params);
      if (response.posts.length === 0) setHasMore(false);
      const postsWithTitle = response.posts.map((p) => postWithDetails(response.tags, p, response.votes));
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

  const getLocalPost = async (page, isFirst, key) => {
    try {
      if (!isFirst) setFetching(true);
      var newHistory = [];
      const currentHistory = await getData(key);
      if (currentHistory) {
        const pageIndex = 18 * (page - 1);
        const start = pageIndex;
        const end = page * 18;
        const newData = currentHistory.slice(start, end);
        if (newData.length === 0) setHasMore(false);
        newHistory = [...data, ...newData];
        if (page === 1) newHistory = newData;
      }
      if (!message || message === 'Error, please try again later :(') setMessage('Nobody here but us chickens!');
      setData(newHistory);
      clearLoading();
    } catch (error) {
      console.log('GET_HISTORY_ERROR: ', error);
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
    setLoading(true);
    refetch();
  }, [autoPlay]);

  useEffect(() => {
    if (from === 'Search') {
      clearLoading();
    } else if (from === 'History') {
      setLoading(true);
      getLocalPost(page, true, 'postHistory');
    } else if (from === 'Watch Later') {
      setLoading(true);
      getLocalPost(page, true, 'watchList');
    } else if (!search) {
      setLoading(true);
      fetchPost(page, true);
    }
    if (setRemoveAll) setRemoveAll(removeAllItems);
  }, []);

  const removeAllItems = async () => {
    setLoading(true);
    const key = from === 'History' ? 'postHistory' : 'watchList';
    await removeData(key);
    getLocalPost(1, true, key);
    Toast.show(`${from} list cleared`);
  };

  const removeItem = async (item) => {
    setLoading(true);
    const key = from === 'History' ? 'postHistory' : 'watchList';
    const items = await getData(key);
    const newItems = items.filter((i) => i.id !== item.id);
    await storeData(key, newItems);
    getLocalPost(1, true, key);
    Toast.show(`Post removed`);
  };

  const deleteAlert = (item) =>
    Alert.alert('Remove', `Do you want to remove this post from your ${from} list ?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Confirm', onPress: () => removeItem(item), style: 'destructive' },
    ]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return layoutType === 'small' ? (
        <CardSmall item={item} deleteAlert={showDeleteButton ? deleteAlert : false} navigateDetail={navigateDetail} />
      ) : (
        <Card
          ref={(ref) => (cellRefs[index] = ref)}
          item={item}
          deleteAlert={showDeleteButton ? deleteAlert : false}
          navigateDetail={navigateDetail}
          autoPlay={autoPlay}
        />
      );
    },
    [layoutType, autoPlay],
  );

  const onEndReached = async () => {
    if (!isLoading && !isFetching && !isRefetching && hasMore) {
      if (from === 'History' || from === 'Watch Later') {
        const key = from === 'History' ? 'postHistory' : 'watchList';
        getLocalPost(page + 1, false, key);
      } else {
        fetchPost(page + 1, false, search);
      }
      setPage(page + 1);
    }
  };

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const refetch = useCallback(() => {
    if (!isLoading && !isFetching && !isRefetching) {
      setRefetching(true);
      if (from === 'History' || from === 'Watch Later') {
        const key = from === 'History' ? 'postHistory' : 'watchList';
        getLocalPost(1, true, key);
      } else {
        fetchPost(1, true, search);
      }

      setPage(1);
    }
  }, [isLoading, isFetching, isRefetching]);

  const onViewableItemsChanged = useCallback(({ changed }) => {
    const item = changed[0];
    const cell = cellRefs[item.index];
    if (cell) {
      if (item.isViewable) {
        cell.playVideo();
        viewableIndex = item.index;
      } else {
        cell.pauseVideo();
      }
    }
  }, []);

  if (focus) return <Layout style={{ ...styles.center, height: '100%' }} />;
  if (isLoading)
    return (
      <Layout style={{ ...styles.center, height: '100%' }}>
        <ActivityIndicator color="#D4D4D4" />
      </Layout>
    );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      initialNumToRender={layoutType === 'small' ? 8 : 4}
      maxToRenderPerBatch={layoutType === 'small' ? 8 : 4}
      windowSize={layoutType === 'small' ? 8 : 6}
      onEndReachedThreshold={8}
      updateCellsBatchingPeriod={100}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        minimumViewTime: 200,
        viewAreaCoveragePercentThreshold: 90,
      }}
      contentContainerStyle={{
        paddingBottom: 10,
      }}
      onEndReached={onEndReached}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          onRefresh={refetch}
          refreshing={isRefetching}
          colors={['#D4D4D4']}
          tintColor="#D4D4D4"
          progressBackgroundColor="#141414"
        />
      }
      ListFooterComponent={
        isFetching &&
        !isRefetching && (
          <Layout style={styles.center}>
            <ActivityIndicator color="#D4D4D4" />
          </Layout>
        )
      }
      ListEmptyComponent={
        !isFetching && (
          <Layout style={{ ...styles.center, height: screenHeight * 0.8 }}>
            <Button size="giant" status="basic" appearance="ghost" accessoryRight={UmbrellaIcon} />
            <Text appearance="hint" category="s1">
              {message}
            </Text>
          </Layout>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', height: 132, width: '100%' },
});
