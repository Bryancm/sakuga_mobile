import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { PostVerticalList } from '../components/postVerticalList';
import { getData } from '../util/storage';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const NewScreen = ({ navigation }) => {
  const [layoutType, setLayoutType] = useState();

  const loadSettings = async () => {
    const settings = await getData('userSettings');
    if (settings && settings.sizeForNew && settings.sizeForNew !== layoutType)
      return setLayoutType(settings.sizeForNew);
    setLayoutType('large');
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
        {layoutType ? (
          <PostVerticalList layoutType={layoutType} />
        ) : (
          <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </Layout>
        )}
      </SafeAreaView>
    </Layout>
  );
};
