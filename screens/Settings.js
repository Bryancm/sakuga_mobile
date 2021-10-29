import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  ListItem,
  Button,
  Radio,
  Toggle,
} from '@ui-kitten/components';
import { storeData, getData, removeData } from '../util/storage';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const LayoutIcon = (props) => <Icon {...props} name="layout-outline" />;
const PlayIcon = (props) => <Icon {...props} name="play-circle-outline" />;

export const SettingScreen = ({ navigation, route }) => {
  const [settings, setSettings] = useState();

  const logOut = async () => {
    const removed = await removeData('user');
    if (removed) {
      navigateBack();
    }
  };

  const loadSettings = async () => {
    const userSettings = await getData('userSettings');
    if (userSettings) return setSettings(userSettings);
    const defaultSettings = {
      sizeForNew: Platform.isPad ? 'grid' : 'large',
      sizeForSearch: Platform.isPad ? 'grid' : 'small',
      autoPlay: true,
    };
    await storeData('userSettings', defaultSettings);
    setSettings(defaultSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const changeSettings = async ({
    sizeForNew = settings.sizeForNew,
    sizeForSearch = settings.sizeForSearch,
    autoPlay = settings.autoPlay,
  }) => {
    const newSettings = { ...settings, sizeForNew, sizeForSearch, autoPlay };
    await storeData('userSettings', newSettings);
    setSettings(newSettings);
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const radioLarge = () => (
    <Radio checked={settings.sizeForNew == 'large'} onChange={() => changeSettings({ sizeForNew: 'large' })} />
  );
  const radioSmall = () => (
    <Radio checked={settings.sizeForNew == 'small'} onChange={() => changeSettings({ sizeForNew: 'small' })} />
  );
  const radioGrid = () => (
    <Radio checked={settings.sizeForNew == 'grid'} onChange={() => changeSettings({ sizeForNew: 'grid' })} />
  );
  const radioLarge2 = () => (
    <Radio checked={settings.sizeForSearch == 'large'} onChange={() => changeSettings({ sizeForSearch: 'large' })} />
  );
  const radioSmall2 = () => (
    <Radio checked={settings.sizeForSearch == 'small'} onChange={() => changeSettings({ sizeForSearch: 'small' })} />
  );
  const radioGrid2 = () => (
    <Radio checked={settings.sizeForSearch == 'grid'} onChange={() => changeSettings({ sizeForSearch: 'grid' })} />
  );
  const toggleAutoplay = () => (
    <Toggle size="small" checked={settings.autoPlay} onChange={(autoPlay) => changeSettings({ autoPlay })} />
  );

  const logOutAlert = () =>
    Alert.alert('Log out', 'Do you want to log out ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: logOut, style: 'destructive' },
    ]);

  if (!settings)
    return (
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </Layout>
    );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Settings" alignment="center" accessoryLeft={BackAction} />
        <Divider />
        <ScrollView style={{ flex: 1 }}>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={LayoutIcon} style={{ paddingLeft: 0, width: 220 }}>
              <Text category="h6">Layout for "New"</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem
              title="Large list"
              accessoryRight={radioLarge}
              onPress={() => changeSettings({ sizeForNew: 'large' })}
            />
            <Divider />
            <ListItem
              title="Small list"
              accessoryRight={radioSmall}
              onPress={() => changeSettings({ sizeForNew: 'small' })}
            />
            {Platform.isPad && <Divider />}
            {Platform.isPad && (
              <ListItem
                title="Grid"
                accessoryRight={radioGrid}
                onPress={() => changeSettings({ sizeForNew: 'grid' })}
              />
            )}
          </Layout>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={LayoutIcon} style={{ paddingLeft: 0, width: 240 }}>
              <Text category="h6">Layout for "Search"</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem
              title="Large list"
              accessoryRight={radioLarge2}
              onPress={() => changeSettings({ sizeForSearch: 'large' })}
            />
            <Divider />
            <ListItem
              title="Small list"
              accessoryRight={radioSmall2}
              onPress={() => changeSettings({ sizeForSearch: 'small' })}
            />
            {Platform.isPad && <Divider />}
            {Platform.isPad && (
              <ListItem
                title="Grid"
                accessoryRight={radioGrid2}
                onPress={() => changeSettings({ sizeForSearch: 'grid' })}
              />
            )}
          </Layout>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={PlayIcon} style={{ paddingLeft: 0, width: 143 }}>
              <Text category="h6">Previews</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem
              title="Autoplay"
              description="Only applies to a large list layout"
              accessoryRight={toggleAutoplay}
              onPress={() => changeSettings({ autoPlay: !settings.autoPlay })}
            />
            <Divider />
          </Layout>

          <Button appearance="ghost" status="info" onPress={logOutAlert}>
            Log out
          </Button>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
