import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Layout, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { LoginForm } from '../components/loginForm';
import { getData } from '../util/storage';
import { useNavigation } from '@react-navigation/native';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const LoginScreen = () => {
  const [user, setUser] = useState();
  const navigation = useNavigation();

  const loadUser = async () => {
    let newUser = false;
    const currentUser = await getData('user');
    if (currentUser && currentUser.name !== user) newUser = currentUser.name;
    setUser(newUser);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadUser();
  }, []);

  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateBackFavorites = () => {
    navigateBack();
    setTimeout(() => {
      // console.log({ user });
      navigatePostList('Favorites', true, 'Favorites', `vote:3:${user} order:vote`);
    }, 500);
  };
  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.navigate('PostList', { from, isPosts, menuType, search, order, type, user });
  };

  const navigateCreateAccount = () => navigation.navigate('CreateAccount');

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  if (user === undefined)
    return (
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#D4D4D4" />
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Login" alignment="center" accessoryLeft={renderBackAction} />
        <ScrollView>
          <LoginForm
            loadUser={loadUser}
            from="favorites"
            navigateBack={navigateBack}
            navigatePostList={navigatePostList}
            navigateCreateAccount={navigateCreateAccount}
          />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
