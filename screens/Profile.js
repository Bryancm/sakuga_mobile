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
import { PostHorizontalList } from '../components/postHorizontalList';
import { getData } from '../util/storage';

const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const ArrowIcon = (props) => <Icon {...props} name="arrow-ios-forward-outline" />;
const HeartIcon = (props) => <Icon {...props} name="heart-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ProfileScreen = ({ navigation }) => {
  const renderSearchAction = () => (
    <TopNavigationAction delayPressIn={0} delayPressOut={0} icon={SearchIcon} onPress={navigateSearch} />
  );
  const renderFavIcon = () => <Button appearance="ghost" accessoryLeft={HeartIcon} />;
  const renderClockIcon = () => <Button appearance="ghost" accessoryLeft={ClockIcon} />;
  const renderSettingsAction = () => <Button appearance="ghost" accessoryLeft={SettingsIcon} />;
  const renderArchiveIcon = () => <Button appearance="ghost" accessoryLeft={ArchiveIcon} />;
  const [user, setUser] = useState();
  const [loadRecent, setLoadRecent] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadUser();
      setLoadRecent(false);
      setTimeout(() => setLoadRecent(true), 200);
    });
    return unsubscribe;
  }, [navigation]);

  const loadUser = async () => {
    let newUser = false;
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

  const onFavoritesPress = () => {
    if (user) return navigatePostList('Favorites', true, 'Favorites', `vote:3:${user} order:vote`);
    navigation.navigate('Login');
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
        <TopNavigation title="Library" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        <ScrollView>
          <Layout style={{ flexDirection: 'row' }}>
            <Button size="giant" appearance="ghost" style={{ paddingLeft: 0 }}>
              <Text category="h4">{`Welcome ${user ? user : ''}`}</Text>
            </Button>
          </Layout>
          <ListItem
            title="Favorites"
            description="Good, great and favorites posts"
            accessoryLeft={renderFavIcon}
            accessoryRight={ArrowIcon}
            onPress={onFavoritesPress}
          />
          <ListItem
            title="History"
            description="Viewed posts"
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
          {loadRecent && <PostHorizontalList title="Recent" from="Recent" />}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
