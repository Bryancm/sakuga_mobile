import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SmallCard } from './cardHorizontal';
import { useNavigation } from '@react-navigation/native';
import { getPosts } from '../api/post';
import { tagStyles } from '../styles';

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const PostHorizontalList = ({ search = '', title, tags, menuType }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('Nobody here but us chickens!');
  const navigation = useNavigation();

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
  };

  useEffect(() => {
    setLoading(true);
    fetchPost(1, true, search);
  }, [search]);

  const navigateDetail = (item, title, tags) => {
    navigation.navigate('Detail', { item, title, tags });
  };

  const renderItem = ({ item }) => <SmallCard item={item} navigateDetail={navigateDetail} />;

  const navigatePostList = () => {
    navigation.navigate('PostList', { from: title, data, tags, isPosts: true, menuType });
  };

  const keyExtractor = (item) => item.id.toString();

  return (
    <Layout>
      {title !== '' && (
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text category="h4" style={{ paddingHorizontal: 5, paddingVertical: 15 }}>
            {title}
          </Text>
          <Button style={{ width: 100, paddingRight: 0 }} appearance="ghost" onPress={navigatePostList}>
            <Text category="p2">See more</Text>
          </Button>
        </Layout>
      )}

      {isLoading ? (
        <Layout style={styles.center}>
          <ActivityIndicator />
        </Layout>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderItem}
          windowSize={6}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          keyExtractor={keyExtractor}
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', height: 244, width: '100%' },
});
