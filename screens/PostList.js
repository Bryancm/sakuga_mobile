import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import { PostVerticalList } from '../components/postVerticalList';
import { TagVerticalList } from '../components/tagVerticalList';
import { formatDateForSearch, getYesterdayDate, getWeekDate, getMonthDate, getYearDate } from '../util/date';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const FilterIcon = (props) => <Icon {...props} name="funnel-outline" />;
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
const TrashIcon = (props) => <Icon {...props} name="trash-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;

export const PostListScreen = ({ navigation, route }) => {
  const from = route.params.from;
  const isPosts = route.params.isPosts;
  const [search, setSearch] = React.useState(route.params.search ? route.params.search : '');
  const [order, setOrder] = React.useState(route.params.order ? route.params.order : 'date');
  const [type, setType] = React.useState(route.params.type ? route.params.type : '');

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [secondMenuVisible, setSecondMenuVisible] = React.useState(false);

  React.useEffect(() => {}, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleSecondMenu = () => {
    setSecondMenuVisible(!secondMenuVisible);
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const clearHistory = () => {};

  const clearAlert = () =>
    Alert.alert('Remove all', `Do you want to clear your ${from === 'History' ? 'History' : 'Watch List'} ?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Confirm', onPress: () => console.log('OK Pressed'), style: 'destructive' },
    ]);

  const deleteAlert = (item) =>
    Alert.alert(
      'Remove',
      `Do you want to remove this post from your ${from === 'History' ? 'History' : 'Watch List'} ?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Confirm', onPress: () => console.log('OK Pressed'), style: 'destructive' },
      ],
    );

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const renderMenuAction = () => <TopNavigationAction icon={CalendarIcon} onPress={toggleMenu} />;
  const renderFilterAction = () => <TopNavigationAction icon={FilterIcon} onPress={toggleMenu} />;
  const renderOptionsAction = () => <TopNavigationAction icon={OptionsIcon} onPress={toggleSecondMenu} />;

  const changeTrendingDay = (date) => {
    toggleMenu();
    setSearch(`date:${formatDateForSearch(date)} order:score`);
  };

  const dateItems = [
    <MenuItem key="24 hours" title="Today" onPress={() => changeTrendingDay(new Date())} />,
    <MenuItem key="Yesterday" title="Yesterday" onPress={() => changeTrendingDay(getYesterdayDate(new Date()))} />,
    <MenuItem
      key="Before yesterday"
      title="2 days ago"
      onPress={() => {
        const yesterdayDate = getYesterdayDate(new Date());
        const beforeYesterday = getYesterdayDate(yesterdayDate);
        changeTrendingDay(beforeYesterday);
      }}
    />,
    <MenuItem
      key="3 days ago"
      title="3 days ago"
      onPress={() => {
        const yesterdayDate = getYesterdayDate(new Date());
        const daysAgo2 = getYesterdayDate(yesterdayDate);
        const daysAgo3 = getYesterdayDate(daysAgo2);
        changeTrendingDay(daysAgo3);
      }}
    />,
  ];

  const weekItems = [
    <MenuItem key="This week" title="This week" />,
    <MenuItem key="Past week" title="Past week" />,
    <MenuItem key="2 weeks ago" title="2 weeks ago" />,
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

  var renderRightActions = () => (
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

  const favActions = () => (
    <React.Fragment>
      <OverflowMenu anchor={renderFilterAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem key="1" title="Good only" accessoryLeft={StarIconGood} />
        <MenuItem key="2" title="Great only" accessoryLeft={StarIconGreat} />
        <MenuItem key="3" title="Favorite only" accessoryLeft={StarIconFav} />
      </OverflowMenu>
      <OverflowMenu anchor={renderOptionsAction} visible={secondMenuVisible} onBackdropPress={toggleSecondMenu}>
        <MenuItem key="4" title="Sort by date" />
        <MenuItem key="5" title="Sort by score" />
      </OverflowMenu>
    </React.Fragment>
  );

  const historyActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={TrashIcon} onPress={clearAlert} />
    </React.Fragment>
  );

  const TagSortActions = () => (
    <OverflowMenu anchor={renderOptionsAction} visible={secondMenuVisible} onBackdropPress={toggleSecondMenu}>
      <MenuItem title="Sort by date" />
      <MenuItem title="Sort by count" />
      <MenuItem title="Sort by name" />
    </OverflowMenu>
  );

  const PostSortActions = () => (
    <OverflowMenu anchor={renderOptionsAction} visible={secondMenuVisible} onBackdropPress={toggleSecondMenu}>
      <MenuItem title="Sort by date" />
      <MenuItem title="Sort by score" />
    </OverflowMenu>
  );

  if (from === 'Favorites') renderRightActions = favActions;
  if (from === 'History') renderRightActions = historyActions;
  if (from === 'Watch Later') renderRightActions = historyActions;
  if (route.params.menuType === 'tag') renderRightActions = TagSortActions;
  if (route.params.menuType === 'post') renderRightActions = PostSortActions;

  var showDeleteButton = false;
  if (from === 'History' || from === 'Watch Later') showDeleteButton = deleteAlert;

  const formatTitle = (title) => {
    if (title.length > 30) {
      return title.slice(0, 30) + '...';
    }
    return title;
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={formatTitle(from)}
          alignment="center"
          accessoryLeft={BackAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          {isPosts && <PostVerticalList search={search} layoutType="small" deleteAlert={showDeleteButton} />}
          {!isPosts && <TagVerticalList search={search} order={order} type={type} />}
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
