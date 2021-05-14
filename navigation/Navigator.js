import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

import { NewScreen } from '../screens/New';
import { ExploreScreen } from '../screens/Explore';
import { SearchScreen } from '../screens/Search';
import { ProfileScreen } from '../screens/Profile';
import { PostListScreen } from '../screens/PostList';
import { SettingScreen } from '../screens/Settings';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const FilmIcon = (props) => <Icon {...props} name="film-outline" />;
const CompassIcon = (props) => <Icon {...props} name="compass-outline" />;

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={NewScreen} />
  </Stack.Navigator>
);
const ExploreStackNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Explore" component={ExploreScreen} />
  </Stack.Navigator>
);

const ProfileStackNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    appearance="noIndicator"
    style={styles.bottomNavigation}
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title="New" icon={FilmIcon} />
    <BottomNavigationTab title="Explore" icon={CompassIcon} />
    <BottomNavigationTab title="Profile" icon={PersonIcon} />
  </BottomNavigation>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator initialRouteName="Explore" tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Explore" component={ExploreStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode={false} mode="card" initialRouteName="Home">
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="PostList" component={PostListScreen} />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ cardStyleInterpolator: forFade }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    paddingTop: 8,
    paddingBottom: 30,
  },
});
