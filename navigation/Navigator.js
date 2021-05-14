import React from 'react';
import { StyleSheet, Animated } from 'react-native';
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
import { DetailsScreen } from '../screens/Detail';

const { multiply } = Animated;

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const FilmIcon = (props) => <Icon {...props} name="film-outline" />;
const CompassIcon = (props) => <Icon {...props} name="compass-outline" />;

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const forHorizontalModal = ({ current, next, inverted, layouts: { screen } }) => {
  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  );

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: 'clamp',
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card in back
        { translateX: 0 },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
    shadowStyle: { shadowOpacity },
  };
};

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
    <Stack.Navigator headerMode={false} mode="modal" initialRouteName="Home">
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen
        name="PostList"
        component={PostListScreen}
        options={{ gestureDirection: 'horizontal', cardStyleInterpolator: forHorizontalModal }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ gestureDirection: 'horizontal', cardStyleInterpolator: forHorizontalModal }}
      />
      <Stack.Screen name="Search" component={SearchScreen} options={{ cardStyleInterpolator: forFade }} />
      <Stack.Screen name="Detail" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    paddingTop: 8,
    paddingBottom: 30,
  },
});
