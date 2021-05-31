import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
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
import { LoginForm } from '../components/loginForm';
import { getData } from '../util/storage';

const PlusIcon = (props) => <Icon {...props} name="plus-circle-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const ArrowIcon = (props) => <Icon {...props} name="arrow-ios-forward-outline" />;
const HeartIcon = (props) => <Icon {...props} name="heart-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ProfileScreen = ({ navigation }) => {
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;
  const renderFavIcon = () => <Button appearance="ghost" accessoryLeft={HeartIcon} />;
  const renderClockIcon = () => <Button appearance="ghost" accessoryLeft={ClockIcon} />;
  const renderSettingsAction = () => <Button appearance="ghost" accessoryLeft={SettingsIcon} />;
  const renderArchiveIcon = () => <Button appearance="ghost" accessoryLeft={ArchiveIcon} />;
  const [user, setUser] = useState();

  const loadUser = async () => {
    let newUser = user ? user : false;
    const currentUser = await getData('user');
    if (currentUser && currentUser.name !== user) newUser = currentUser.name;
    setUser(newUser);
  };

  useEffect(() => {
    loadUser();
  }, []);
  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const navigateSettings = () => {
    navigation.navigate('Settings');
  };
  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.navigate('PostList', { from, isPosts, menuType, search, order, type, user });
  };

  if (user === undefined)
    return (
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Profile" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        {user === false ? (
          <ScrollView>
            <LoginForm loadUser={loadUser} />
          </ScrollView>
        ) : (
          <ScrollView>
            <Layout style={{ flexDirection: 'row' }}>
              <Button size="giant" appearance="ghost" style={{ paddingLeft: 0 }}>
                <Text category="h4">{`Welcome ${user}`}</Text>
              </Button>
            </Layout>
            <ListItem
              title="Favorites"
              description="Good, great and favorites sakugas"
              accessoryLeft={renderFavIcon}
              accessoryRight={ArrowIcon}
              onPress={() => navigatePostList('Favorites', true, 'Favorites', `vote:3:${user} order:vote`)}
            />
            <ListItem
              title="History"
              description="Viewed sakugas"
              accessoryLeft={renderClockIcon}
              accessoryRight={ArrowIcon}
              onPress={() => navigatePostList('History', true, 'History')}
            />
            <ListItem
              title="Watch Later"
              description="Do not lose it"
              accessoryLeft={renderArchiveIcon}
              accessoryRight={ArrowIcon}
              onPress={() => navigatePostList('Watch Later', true, 'Watch Later')}
            />
            <ListItem
              title="Settings"
              description="Layout, previews and Log out"
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
              <Button
                size="giant"
                appearance="ghost"
                accessoryRight={PlusIcon}
                style={{ paddingLeft: 0, paddingBottom: 8 }}>
                <Text category="h4">Uploads</Text>
              </Button>
              <Button style={{ width: 100, paddingRight: 0 }} appearance="ghost">
                <Text category="p2">See more</Text>
              </Button>
            </Layout>
            <PostHorizontalList title="" data={data.posts} tags={data.tags} navigation={navigation} />
          </ScrollView>
        )}
      </SafeAreaView>
    </Layout>
  );
};
