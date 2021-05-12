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
import { Tag } from '../components/tagItem';
import { PostVerticalList } from '../components/postVerticalList';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;

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

  const dateItems = [
    <MenuItem key="24 hours" title="24 hours" />,
    <MenuItem key="Yesterday" title="Yesterday" />,
    <MenuItem key="Before yesterday" title="Before yesterday" />,
    <MenuItem key="Other Day" title="Other Day" />,
  ];

  const weekItems = [
    <MenuItem key="This week" title="This week" />,
    <MenuItem key="Past week" title="Past week" />,
    <MenuItem key="Other week" title="Other week" />,
  ];

  const monthItems = [
    <MenuItem key="JAN" title="JAN" />,
    <MenuItem key="FEB" title="FEB" />,
    <MenuItem key="MAR" title="MAR" />,
    <MenuItem key="APR" title="APR" />,
    <MenuItem key="MAY" title="MAY" />,
    <MenuItem key="JUNE" title="JUNE" />,
    <MenuItem key="JULY" title="JULY" />,
    <MenuItem key="AUG" title="AUG" />,
    <MenuItem key="SEPT" title="SEPT" />,
    <MenuItem key="OCT" title="OCT" />,
    <MenuItem key="NOV" title="NOV" />,
    <MenuItem key="DEC" title="DEC" />,
  ];

  const yearItems = [
    <MenuItem key="2021" title="2021" />,
    <MenuItem key="2020" title="2020" />,
    <MenuItem key="2019" title="2019" />,
    <MenuItem key="2018" title="2018" />,
    <MenuItem key="2017" title="2017" />,
    <MenuItem key="2016" title="2016" />,
    <MenuItem key="2015" title="2015" />,
    <MenuItem key="2014" title="2014" />,
    <MenuItem key="2013" title="2013" />,
  ];

  const renderRightActions = () => (
    <React.Fragment>
      {route.params.menuType && (
        <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
          {route.params.menuType === 'date' && dateItems}
          {route.params.menuType === 'week' && weekItems}
          {route.params.menuType === 'month' && monthItems}
          {route.params.menuType === 'year' && yearItems}
        </OverflowMenu>
      )}
    </React.Fragment>
  );

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
          {isPosts && <PostVerticalList data={data} tags={tags} layoutType="small" />}
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
