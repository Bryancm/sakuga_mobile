import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import { SmallCard } from '../components/smallCard';
import { Tag } from '../components/tagItem';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const ArrowDownIcon = (props) => <Icon {...props} name="arrow-down-outline" />;

export const PostListScreen = ({ navigation, route }) => {
  const datePicker = React.useRef();
  const [date, setDate] = React.useState(new Date());
  const [data, setData] = React.useState(route.params.data);
  const [tags, setTags] = React.useState(route.params.tags);
  const [from, setFrom] = React.useState(route.params.from);
  const [isPosts, setIsPosts] = React.useState(route.params.isPosts);

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [layoutType, setLayoutType] = React.useState('large');
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const toggleDatePicker = () => {
    datePicker.current.show();
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const renderMenuAction = () => <TopNavigationAction icon={CalendarIcon} onPress={toggleMenu} />;

  const renderRightActions = () => (
    <React.Fragment>
      {/* <TopNavigationAction icon={CalendarIcon} onPress={toggleDatePicker} /> */}
      <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem title="JAN" />
        <MenuItem title="FEB" />
        <MenuItem title="MAR" />
        <MenuItem title="APR" />
        <MenuItem title="MAY" />
        <MenuItem title="JUN" />
        <MenuItem title="JUL" />
        <MenuItem title="AGO" />
        <MenuItem title="SEP" />
        <MenuItem title="OCT" />
        <MenuItem title="NOV" />
        <MenuItem title="DEC" />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderItem = ({ item }) => <SmallCard item={item} tagsWithType={tags} />;

  const renderTagItem = ({ item }) => <Tag tag={item} />;

  const keyExtractor = (item) => item.id.toString();

  const onSelectDate = (newDate) => {
    console.log(newDate);
    setDate(newDate);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title={from} alignment="center" accessoryLeft={BackAction} accessoryRight={renderRightActions} />

        <Divider />
        <Layout style={{ flex: 1 }}>
          {isPosts && <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />}
          {!isPosts && (
            <FlatList
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={{ paddingHorizontal: 2 }}
              data={data}
              renderItem={renderTagItem}
              keyExtractor={keyExtractor}
            />
          )}
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
