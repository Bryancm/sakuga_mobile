import React, { useState, useCallback } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ScrollView } from 'react-native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Button,
  ListItem,
} from '@ui-kitten/components';
import data from '../test-data-v2.json';
import { PostHorizontalList } from '../components/postHorizontalList';

const PlusIcon = (props) => <Icon {...props} name="plus-circle-outline" style={{ width: 25, height: 25 }} />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const EyeIcon = (props) => <Icon {...props} name="eye-outline" />;
const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const ArrowIcon = (props) => <Icon {...props} name="arrow-ios-forward-outline" />;
const HeartIcon = (props) => <Icon {...props} name="heart-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" style={{ width: 25, height: 25 }} />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ProfileScreen = ({ navigation }) => {
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;
  const renderFavIcon = () => <Button appearance="ghost" accessoryLeft={HeartIcon} />;
  const renderClockIcon = () => <Button appearance="ghost" accessoryLeft={ClockIcon} />;
  const renderSettingsAction = () => <Button appearance="ghost" accessoryLeft={SettingsIcon} />;
  const renderArchiveIcon = () => <Button appearance="ghost" accessoryLeft={ArchiveIcon} />;

  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const navigateSettings = () => {
    navigation.navigate('Settings');
  };
  const navigatePostList = (from) => {
    navigation.navigate('PostList', { from, isPosts: true });
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Profile" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        <ScrollView>
          <Layout style={{ flexDirection: 'row' }}>
            <Button size="giant" appearance="ghost" accessoryRight={PersonIcon} style={{ paddingLeft: 0 }}>
              <Text category="h4">Welcome Bryan</Text>
            </Button>
          </Layout>
          <ListItem
            title="Favorites"
            description="Good, great and favorites sakugas"
            accessoryLeft={renderFavIcon}
            accessoryRight={ArrowIcon}
            onPress={() => navigatePostList('Favorites')}
          />
          <ListItem
            title="History"
            description="Viewed sakugas"
            accessoryLeft={renderClockIcon}
            accessoryRight={ArrowIcon}
            onPress={() => navigatePostList('History')}
          />
          {/* <ListItem
            title="Following"
            description="Keep an eye on the comments"
            accessoryLeft={renderEyeIcon}
            accessoryRight={ArrowIcon}
          /> */}
          <ListItem
            title="Watch Later"
            description="Do not lose it"
            accessoryLeft={renderArchiveIcon}
            accessoryRight={ArrowIcon}
            onPress={() => navigatePostList('Watch Later')}
          />
          <ListItem
            title="Settings"
            description="Configure it to your taste"
            accessoryLeft={renderSettingsAction}
            accessoryRight={ArrowIcon}
            onPress={navigateSettings}
          />
          <Layout
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Button appearance="ghost" accessoryRight={PlusIcon} style={{ paddingLeft: 0 }}>
              <Text category="h4">Uploads</Text>
            </Button>
            <Button style={{ width: 100, paddingRight: 0 }} appearance="ghost">
              <Text category="p2">See more</Text>
            </Button>
          </Layout>
          <PostHorizontalList title="" data={data.posts} tags={data.tags} navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 17,
  },
});
