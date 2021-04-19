import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

export const HomeScreen = ({navigation}) => {
  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  const renderPersonAction = () => <TopNavigationAction icon={PersonIcon} />;

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="New"
          alignment="center"
          accessoryRight={renderPersonAction}
        />
        <Divider />
        <Layout
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Button onPress={navigateDetails}>OPEN DETAILS</Button>
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
