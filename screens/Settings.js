import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  ListItem,
  Button,
} from '@ui-kitten/components';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const LayoutIcon = (props) => <Icon {...props} name="layout-outline" style={{ width: 25, height: 25 }} />;
export const SettingScreen = ({ navigation }) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Settings" alignment="center" accessoryLeft={BackAction} />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <Layout level="2" style={{ padding: 8 }}>
            <Button appearance="ghost" accessoryRight={LayoutIcon} style={{ paddingLeft: 0, width: 250 }}>
              <Text category="h6">Size for "New" section</Text>
            </Button>
          </Layout>
          <ListItem title="Large list" />
          <Divider />
          <ListItem title="Small list" />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
