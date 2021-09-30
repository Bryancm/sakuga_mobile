import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { SmallCard } from './cardHorizontal';
import { useNavigation } from '@react-navigation/native';
import { getPosts } from '../api/post';
import { tagStyles } from '../styles';
import { getData } from '../util/storage';

const PlusIcon = (props) => <Icon {...props} name="plus-circle-outline" />;
const UmbrellaIcon = (props) => <Icon {...props} name="umbrella-outline" />;
const screenWidth = Dimensions.get('window').width;

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const PostHorizontalList = forwardRef((props, ref) => {
  const { itemSearch = '', title, tags, menuType, date, secondDate, from } = props;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    loadPosts() {
      if (!search) setSearch(itemSearch);
    },
  }));

  const postWithDetails = (tagsWithType, post, votes) => {
    var artist = '';
    var copyright = '';
    var tags = [];
    const postTags = post.tags.split(' ');
    for (const tag of postTags) {
      const type = tagsWithType[tag];
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

    const name =
      artist.trim() && artist.trim() !== 'Artist_unknown'
        ? artist.replace('Artist_unknown', '').trim()
        : copyright.trim();
    const title = name ? capitalize(name).replace(/_/g, ' ') : name;

    tags.sort((a, b) => a.type > b.type);
    post.userScore = votes[post.id] ? votes[post.id] : 0;
    post.tags = tags;
    post.title = title;
    return post;
  };

  const fetchPost = async (page, isFirst, search) => {
    try {
      if (!isFirst) setFetching(true);
      if (!search) {
        setData([]);
        return clearLoading();
      }
      var params = { search, page, include_tags: 1, include_votes: 1, limit: 8 };
      const user = await getData('user');
      if (user) params = { ...params, user: user.name, password_hash: user.password_hash };
      const response = await getPosts(params);
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
        const newData = from === 'Recent' ? currentHistory.slice(0, 8) : currentHistory.slice(start, end);
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
  };

  useEffect(() => {
    if (from === 'Recent') {
      setLoading(true);
      getLocalPost(1, true, 'postHistory');
    } else {
      setLoading(true);
      fetchPost(1, true, search);
    }
  }, [search]);

  const navigateDetail = (item, title, tags) => {
    navigation.navigate('Detail', { item, title, tags });
  };

  const renderItem = ({ item }) => <SmallCard item={item} navigateDetail={navigateDetail} />;

  const navigatePostList = () => {
    navigation.navigate('PostList', {
      from: title,
      data,
      tags,
      isPosts: true,
      menuType,
      search,
      date: date ? date.toString() : undefined,
      secondDate: secondDate ? secondDate.toString() : undefined,
    });
  };

  const keyExtractor = (item) => item.id.toString();

  return (
    <Layout>
      {title !== '' && (
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text category="h4" style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
            {title}
          </Text>
          {from !== 'Recent' && (
            <Button style={{ width: 100, paddingRight: 0 }} appearance="ghost" onPress={navigatePostList}>
              <Text category="p2">See more</Text>
            </Button>
          )}
        </Layout>
      )}

      {isLoading ? (
        <Layout style={styles.center}>
          <ActivityIndicator color="#D4D4D4" />
        </Layout>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderItem}
          windowSize={8}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <Layout style={styles.center}>
              <Button
                size="giant"
                status="basic"
                appearance="ghost"
                accessoryRight={from === 'Uploads' ? PlusIcon : UmbrellaIcon}
              />

              <Text appearance="hint" category="s1">
                {from === 'Uploads' ? 'Add a post' : 'Nobody here but us chickens!'}
              </Text>
            </Layout>
          }
        />
      )}
    </Layout>
  );
});

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', height: 244, width: screenWidth },
});
