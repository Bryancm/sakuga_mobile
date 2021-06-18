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
    const settings = await getData('userSettings');
    if (settings) {
      if (settings.autoPlay !== autoPlay || settings.sizeForNew !== layoutType) {
        setAutoPlay();
        setLayoutType();
        setAutoPlay(settings.autoPlay);
        setLayoutType(settings.sizeForNew);
      }
    } else {
      setAutoPlay(true);
      setLayoutType('large');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSettings();
    });
    return unsubscribe;
  }, [navigation, autoPlay, layoutType]);

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
            <ActivityIndicator color="#D4D4D4" />
          </Layout>
        )}
      </SafeAreaView>
    </Layout>
  );
};
