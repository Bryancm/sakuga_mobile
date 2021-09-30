import React, { useCallback, useState } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { PostHorizontalList } from '../components/postHorizontalList';
import { TagHorizontalList } from '../components/tagHorizontalList';
import { exploreData } from '../util/exploreData';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ExploreScreen = ({ navigation }) => {
  let cellRefs = {};
  const [data, setData] = useState(exploreData);
  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;
  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }) =>
      item.menuType === 'tag' ? (
        <TagHorizontalList title={item.title} menuType={item.menuType} type={item.type} order={item.order} />
      ) : (
        <PostHorizontalList
          ref={(ref) => (cellRefs[index] = ref)}
          title={item.title}
          menuType={item.menuType}
          itemSearch={item.search}
          date={item.date}
          secondDate={item.secondDate}
        />
      ),
    [],
  );

  const getItemLayout = useCallback(
    (item, index) => ({
      length: item.menuType === 'tag' ? 100 : 260,
      offset: item.menuType === 'tag' ? 100 * index : 260 * index,
      index,
    }),
    [],
  );

  const onViewableItemsChanged = useCallback(({ changed }) => {
    const item = changed[0];
    const cell = cellRefs[item.index];
    if (cell) {
      if (item.isViewable) {
        cell.loadPosts();
      }
    }
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Explore" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <FlatList
            onViewableItemsChanged={onViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            initialNumToRender={2}
            maxToRenderPerBatch={3}
            windowSize={21}
            updateCellsBatchingPeriod={200}
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
          />
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
