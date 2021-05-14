import React from 'react';
import { SafeAreaView } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const DetailsScreen = ({ navigation, route }) => {
  const item = route.params.item;
  const title = route.params.title;
  const tags = route.params.tags;

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <TopNavigation title={title} alignment="center" accessoryLeft={BackAction} /> */}
        <Divider />
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text category="h1">DETAILS</Text>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
