import React from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {
  Divider,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import {Card} from '../components/card';
import {SmallCard} from '../components/smallCard';
import data from '../test-data-v2.json';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const LayoutIcon = (props) => <Icon {...props} name="layout-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;
const SquareIcon = (props) => <Icon {...props} name="square-outline" />;

export const NewScreen = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [layoutType, setLayoutType] = React.useState('large');
  const renderPersonAction = () => <TopNavigationAction icon={PersonIcon} />;
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} />;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={LayoutIcon} onPress={toggleMenu} />
  );

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={SearchIcon} />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem
          accessoryLeft={SquareIcon}
          title="Large List"
          onPress={() => setLayoutType('large')}
        />
        <MenuItem
          accessoryLeft={SquareIcon}
          title="Small list"
          onPress={() => setLayoutType('small')}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderItem = (info) => {
    if (layoutType === 'small')
      return <SmallCard item={info.item} tagsWithType={data.tags} />;
    return <Card item={info.item} tagsWithType={data.tags} />;
  };

  const keyExtractor = (item) => item.id.toString();

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="New"
          alignment="center"
          accessoryLeft={renderPersonAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
        <FlatList
          style={styles.container}
          data={data.posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
