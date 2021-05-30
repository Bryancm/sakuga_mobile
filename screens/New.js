import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { PostVerticalList } from '../components/postVerticalList';
import { getData } from '../util/storage';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const NewScreen = ({ navigation }) => {
  const [autoPlay, setAutoPlay] = useState();
  const [layoutType, setLayoutType] = useState();

  const loadSettings = async () => {
    let autoPlaySetting = autoPlay ? autoPlay : true;
    let layoutSetting = layoutType ? layoutType : 'large';
    const settings = await getData('userSettings');
    if (settings && settings.autoPlay !== autoPlay) {
      autoPlaySetting = settings.autoPlay;
      setAutoPlay();
    }
    if (settings && settings.sizeForNew !== layoutType) {
      layoutSetting = settings.sizeForNew;
    }

    setAutoPlay(autoPlaySetting);
    setLayoutType(layoutSetting);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadSettings();
    });
    return unsubscribe;
  }, [navigation]);

  const renderSearchIcon = useCallback(() => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />, []);

  const navigateSearch = useCallback(() => {
    navigation.navigate('Search');
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="New" alignment="center" accessoryRight={renderSearchIcon} />
        <Divider />
        {layoutType && autoPlay !== undefined ? (
          <PostVerticalList layoutType={layoutType} autoPlay={autoPlay} />
        ) : (
          <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </Layout>
        )}
      </SafeAreaView>
    </Layout>
  );
};
