import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Layout, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { CreateAccountForm } from '../components/createAccountForm';
import { getData } from '../util/storage';
import { useNavigation } from '@react-navigation/native';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const EditPost = () => {
  const [user, setUser] = useState();
  const navigation = useNavigation();

  //   const loadUser = async () => {
  //     let newUser = false;
  //     const currentUser = await getData('user');
  //     if (currentUser && currentUser.name !== user) newUser = currentUser.name;
  //     setUser(newUser);
  //   };

  //   useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', async () => {
  //       loadUser();
  //     });
  //     return unsubscribe;
  //   }, [navigation]);

  //   useEffect(() => {
  //     loadUser();
  //   }, []);

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Create account" alignment="center" accessoryLeft={renderBackAction} />
        <ScrollView>
          {/* <CreateAccountForm
            loadUser={loadUser}
            from="login"
            navigateBack={navigateBack}
            navigatePostList={navigatePostList}
          /> */}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
