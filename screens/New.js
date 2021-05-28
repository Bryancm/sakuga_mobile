import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import {
  Divider,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import { PostVerticalList } from '../components/postVerticalList';

const LayoutIcon = (props) => <Icon {...props} name="layout-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const NewScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [layoutType, setLayoutType] = React.useState('large');

  const renderSearchIcon = useCallback(() => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />, []);

  const toggleMenu = useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const renderMenuAction = useCallback(() => <TopNavigationAction icon={LayoutIcon} onPress={toggleMenu} />, []);

  const changeLayout = useCallback(
    (type) => {
      toggleMenu();
      setLayoutType(type);
    },
    [menuVisible],
  );

  const navigateSearch = useCallback(() => {
    navigation.navigate('Search');
  }, []);

  const renderRightActions = useCallback(
    () => (
      <React.Fragment>
        <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
          <MenuItem title="Large List" onPress={() => changeLayout('large')} />
          <MenuItem title="Small list" onPress={() => changeLayout('small')} />
        </OverflowMenu>
      </React.Fragment>
    ),
    [menuVisible],
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="New"
          alignment="center"
          accessoryLeft={renderRightActions}
          accessoryRight={renderSearchIcon}
        />
        <Divider />
        <PostVerticalList layoutType={layoutType} />
      </SafeAreaView>
    </Layout>
  );
};
