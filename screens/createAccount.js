import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Layout, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { CreateAccountForm } from '../components/createAccountForm';
import { getData } from '../util/storage';
import { useNavigation } from '@react-navigation/native';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const CreateAccountScreen = () => {
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

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Create account" alignment="center" accessoryLeft={renderBackAction} />
        <ScrollView>
          <CreateAccountForm
            loadUser={loadUser}
            from="login"
            navigateBack={navigateBack}
            navigatePostList={navigatePostList}
          />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
