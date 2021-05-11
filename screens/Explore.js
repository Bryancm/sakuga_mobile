import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon, Text } from '@ui-kitten/components';
import data from '../test-data-v2.json';
import tag_data from '../test-tag-data.json';
import tag_copy_data from '../test-tag-copy-data.json';
import { SmallCard as Card } from '../components/uploadCard';
import { Tag } from '../components/tag';
import { PostHorizontalList } from '../components/postHorizontalList';
import { TagHorizontalList } from '../components/tagHorizontalList';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ExploreScreen = ({ navigation }) => {
  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Explore" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PostHorizontalList title="Trending" data={data.posts} tags={data.tags} navigation={navigation} />
            <TagHorizontalList title="New Artist" data={tag_data} navigation={navigation} />
            <PostHorizontalList title="Week's Popular" data={data.posts} tags={data.tags} navigation={navigation} />
            <PostHorizontalList title="Character Acting" data={data.posts} tags={data.tags} navigation={navigation} />
            <TagHorizontalList title="New Copyright" data={tag_copy_data} navigation={navigation} />
            <PostHorizontalList title="Month's Popular" data={data.posts} tags={data.tags} navigation={navigation} />
            <PostHorizontalList title="Fighting" data={data.posts} tags={data.tags} navigation={navigation} />
            <TagHorizontalList title="Popular Artist" data={tag_data} navigation={navigation} />
            <PostHorizontalList title="Liquid" data={data.posts} tags={data.tags} navigation={navigation} />
            <PostHorizontalList title="Explosions" data={data.posts} tags={data.tags} navigation={navigation} />
            <TagHorizontalList title="Popular Copyright" data={tag_copy_data} navigation={navigation} />
            <PostHorizontalList title="Hair" data={data.posts} tags={data.tags} navigation={navigation} />
            <PostHorizontalList
              title="Production Materials"
              data={data.posts}
              tags={data.tags}
              navigation={navigation}
            />
            <PostHorizontalList title="Year's Popular" data={data.posts} tags={data.tags} navigation={navigation} />
          </ScrollView>
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
