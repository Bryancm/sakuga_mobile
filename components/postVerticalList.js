import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
  Dimensions,
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';
import { SmallCard as GridCard } from './cardHorizontal';
import { getPosts } from '../api/post';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { tagStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import { getData, storeData, removeData } from '../util/storage';
import Toast from 'react-native-simple-toast';
import { verticalScale } from 'react-native-size-matters';
import { postWithDetails } from '../util/post';

const UmbrellaIcon = (props) => <Icon {...props} name="umbrella-outline" />;
const screenHeight = Dimensions.get('window').height;

export const PostVerticalList = ({
  search = '',
  layoutType,
  showDeleteButton,
  focus,
  from,
  setRemoveAll,
  autoPlay,
}) => {
  const { width } = useWindowDimensions();
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

  const navigateDetail = useCallback((item, title, tags) => {
    navigation.push('Detail', { item, title, tags });
  }, []);

  const fetchPost = useCallback(
    async (page, isFirst, search) => {
      try {
        if (!isFirst) setFetching(true);
        var params = { search, page, include_tags: 1, include_votes: 1 };
        const user = await getData('user');
        if (user) params = { ...params, user: user.name, password_hash: user.password_hash };
        const response = await getPosts(params);
        if (response.posts.length === 0) setHasMore(false);
        var newData = [];
        if (page === 1) {
          newData = response.posts.map((p) => postWithDetails(response.tags, p, response.votes));
        } else {
          var newPosts = [];
          for (const p of response.posts) {
            const newPost = postWithDetails(response.tags, p, response.votes);
            const index = data.findIndex((post) => post.id === newPost.id);
            if (index === -1) newPosts.push(newPost);
          }
          newData = data.concat(newPosts);
        }
        if (!message || message === 'Error, please try again later :(') setMessage('Nobody here but us chickens!');
        setData(newData);
        clearLoading();
      } catch (error) {
        console.log('FETCH_POST_ERROR: ', error);
        setData([]);
        setMessage('Error, please try again later :(');
        clearLoading();
      }
    },
    [data],
  );

  const getLocalPost = useCallback(
    async (page, isFirst, key) => {
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
    },
    [data],
  );

  const clearLoading = useCallback(() => {
    setLoading(false);
    setFetching(false);
    setRefetching(false);
  }, []);

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

  const removeAllItems = useCallback(async () => {
    setLoading(true);
    const key = from === 'History' ? 'postHistory' : 'watchList';
    await removeData(key);
    getLocalPost(1, true, key);
    Toast.showWithGravity(`${from} list cleared`, Toast.SHORT, Toast.CENTER);
  }, []);

  const removeItem = useCallback(async (item) => {
    setLoading(true);
    const key = from === 'History' ? 'postHistory' : 'watchList';
    const items = await getData(key);
    const newItems = items.filter((i) => i.id !== item.id);
    await storeData(key, newItems);
    getLocalPost(1, true, key);
    Toast.showWithGravity(`Removed`, Toast.SHORT, Toast.CENTER);
  }, []);

  const deleteAlert = useCallback(
    (item) =>
      Alert.alert('Remove', `Do you want to remove this post from your ${from} list ?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Confirm', onPress: () => removeItem(item), style: 'destructive' },
      ]),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      if (layoutType === 'grid' && width > 507)
        return (
          <GridCard item={item} deleteAlert={showDeleteButton ? deleteAlert : false} navigateDetail={navigateDetail} />
        );

      if (layoutType === 'large')
        return (
          <Card
            ref={(ref) => (cellRefs[index] = ref)}
            item={item}
            deleteAlert={showDeleteButton ? deleteAlert : false}
            navigateDetail={navigateDetail}
            autoPlay={autoPlay}
          />
        );

      return (
        <CardSmall item={item} deleteAlert={showDeleteButton ? deleteAlert : false} navigateDetail={navigateDetail} />
      );
    },
    [autoPlay, showDeleteButton, layoutType, width],
  );

  const onEndReached = useCallback(async () => {
    if (!isLoading && !isFetching && !isRefetching && hasMore) {
      if (from === 'History' || from === 'Watch Later') {
        const key = from === 'History' ? 'postHistory' : 'watchList';
        getLocalPost(page + 1, false, key);
      } else {
        fetchPost(page + 1, false, search);
      }
      setPage(page + 1);
    }
  }, [isLoading, isFetching, isRefetching, hasMore]);

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
  }, [isFetching, isLoading, isRefetching]);

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

  const getItemLayout = useCallback((d, index) => ({
    length: verticalScale(200),
    offset: verticalScale(200) * index,
    index,
  }));

  const listProps = useCallback(() => {
    var props = {
      initialNumToRender: 9,
      maxToRenderPerBatch: 9,
      windowSize: 19,
      numColumns: 1,
    };
    if (layoutType === 'grid') {
      props.initialNumToRender = 9;
      props.maxToRenderPerBatch = 3;
      props.windowSize = 19;
      props.numColumns = 3;
      props.columnWrapperStyle = {
        flex: 1,
        justifyContent: 'space-evenly',
      };
      props.getItemLayout = getItemLayout;
    }
    if (layoutType === 'large') {
      props.initialNumToRender = 3;
      props.maxToRenderPerBatch = 6;
      props.windowSize = 12;
      props.numColumns = 1;
    }
    if (width <= 507 && Platform.isPad) {
      props.initialNumToRender = 9;
      props.maxToRenderPerBatch = 9;
      props.windowSize = 12;
      props.numColumns = 1;
      delete props.columnWrapperStyle;
    }
    return props;
  }, [layoutType, width]);

  if (focus) return <Layout style={{ ...styles.center, height: '100%' }} />;
  if (isLoading)
    return (
      <Layout style={{ ...styles.center, height: '100%' }}>
        <ActivityIndicator color="#D4D4D4" />
      </Layout>
    );

  const onScroll = (event) =>
    Animated.event([], {
      useNativeDriver: true,
    });

  return (
    <Animated.FlatList
      {...listProps()}
      key={`post_list_${layoutType}_${width}`}
      data={data}
      renderItem={renderItem}
      onEndReachedThreshold={0.5}
      updateCellsBatchingPeriod={100}
      viewabilityConfig={{
        minimumViewTime: 300,
        viewAreaCoveragePercentThreshold: 70,
      }}
      contentContainerStyle={{
        paddingBottom: 10,
      }}
      onEndReached={onEndReached}
      keyExtractor={keyExtractor}
      onScroll={onScroll}
      onViewableItemsChanged={onViewableItemsChanged}
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
