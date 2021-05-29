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
import {
  formatDateForSearch,
  getYesterdayDate,
  getWeekDate,
  getMonthDate,
  getYearDate,
  getTomorrowDate,
} from '../util/date';
import { useNavigation } from '@react-navigation/native';

const LeftIcon = (props) => <Icon {...props} name="chevron-left-outline" />;
const RightIcon = (props) => <Icon {...props} name="chevron-right-outline" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const FilterIcon = (props) => <Icon {...props} name="funnel-outline" />;
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
const TrashIcon = (props) => <Icon {...props} name="trash-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;

export const PostListScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = route.params.user;
  const from = route.params.from;
  const isPosts = route.params.isPosts;
  const menuType = route.params.menuType;
  const dateParam = route.params.date;
  const secondDateParam = route.params.secondDate;
  const [title, setTitle] = React.useState(from);
  const [search, setSearch] = React.useState(route.params.search ? route.params.search : '');
  const [order, setOrder] = React.useState(route.params.order ? route.params.order : 'date');
  const [type, setType] = React.useState(route.params.type ? route.params.type : '');
  const [date, setDate] = React.useState(dateParam ? new Date(dateParam) : undefined);
  const [secondDate, setSecondDate] = React.useState(secondDateParam ? new Date(secondDateParam) : undefined);

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [secondMenuVisible, setSecondMenuVisible] = React.useState(false);

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
  const renderFilterAction = () => <TopNavigationAction icon={FilterIcon} onPress={toggleMenu} />;
  const renderOptionsAction = () => <TopNavigationAction icon={OptionsIcon} onPress={toggleSecondMenu} />;

  const prevDate = () => {
    if (menuType === 'date') {
      const prevDate = getYesterdayDate(date);
      setSearch(`date:${formatDateForSearch(prevDate)} order:score`);
      setDate(prevDate);
      return;
    }
    if (menuType === 'week') {
      const yesterday = getYesterdayDate(date);
      const twoDaysAgo = getYesterdayDate(yesterday);
      const { firstDayWeek, lastDayWeek } = getWeekDate(twoDaysAgo);
      setSearch(`date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`);
      setDate(firstDayWeek);
      setSecondDate(lastDayWeek);
      return;
    }
    if (menuType === 'month') {
      const yesterday = getYesterdayDate(date);
      const { firstDayMonth, lastDayMonth } = getMonthDate(yesterday);
      setSearch(`date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`);
      setDate(firstDayMonth);
      setSecondDate(lastDayMonth);
      return;
    }
    if (menuType === 'year') {
      const year =
        getYesterdayDate(date).getFullYear() === date.getFullYear()
          ? getYesterdayDate(date).getFullYear() - 1
          : getYesterdayDate(date).getFullYear();
      if (year >= 2013) {
        const { firstDayYear, lastDayYear } = getYearDate(year);
        setSearch(`date:${formatDateForSearch(firstDayYear)}...${formatDateForSearch(lastDayYear)} order:score`);
        setDate(firstDayYear);
        setSecondDate(lastDayYear);
      }
      return;
    }
  };
  const nextDate = () => {
    if (menuType === 'date') {
      const nextDate = getTomorrowDate(date);
      if (nextDate <= new Date()) {
        setSearch(`date:${formatDateForSearch(nextDate)} order:score`);
        setDate(nextDate);
      }
      return;
    }
    if (menuType === 'week') {
      const tomorrow = getTomorrowDate(secondDate);
      const { firstDayWeek, lastDayWeek } = getWeekDate(tomorrow);
      if (firstDayWeek <= new Date()) {
        setSearch(`date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`);
        setDate(firstDayWeek);
        setSecondDate(lastDayWeek);
      }
      return;
    }
    if (menuType === 'month') {
      const tomorrow = getTomorrowDate(secondDate);
      const { firstDayMonth, lastDayMonth } = getMonthDate(tomorrow);
      if (firstDayMonth.getMonth() <= new Date().getMonth()) {
        setSearch(`date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`);
        setDate(firstDayMonth);
        setSecondDate(lastDayMonth);
      }
      return;
    }
    if (menuType === 'year') {
      const year = getTomorrowDate(secondDate).getFullYear();
      if (year <= new Date().getFullYear()) {
        const { firstDayYear, lastDayYear } = getYearDate(year);
        setSearch(`date:${formatDateForSearch(firstDayYear)}...${formatDateForSearch(lastDayYear)} order:score`);
        setDate(firstDayYear);
        setSecondDate(lastDayYear);
      }
      return;
    }
  };

  const prevButtonOpacity = () => {
    const year =
      getYesterdayDate(date).getFullYear() === date.getFullYear()
        ? getYesterdayDate(date).getFullYear() - 1
        : getYesterdayDate(date).getFullYear();
    if (year < 2013) return { opacity: 0.5 };
    return { opacity: 1 };
  };

  const nextButtonOpacity = () => {
    if (menuType === 'date' && getTomorrowDate(date) > new Date()) {
      return { opacity: 0.5 };
    }

    if (menuType === 'week') {
      const tomorrow = getTomorrowDate(secondDate);
      const { firstDayWeek } = getWeekDate(tomorrow);
      if (firstDayWeek > new Date()) return { opacity: 0.5 };
    }
    if (menuType === 'month') {
      const tomorrow = getTomorrowDate(secondDate);
      const { firstDayMonth } = getMonthDate(tomorrow);
      if (firstDayMonth.getMonth() > new Date().getMonth()) return { opacity: 0.5 };
    }
    if (menuType === 'year') {
      const year = getTomorrowDate(date).getFullYear();
      if (year + 1 > new Date().getFullYear()) return { opacity: 0.5 };
    }
    return { opacity: 1 };
  };

  var renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction
        icon={LeftIcon}
        onPress={prevDate}
        style={prevButtonOpacity()}
        disabled={prevButtonOpacity().opacity !== 1}
      />
      <TopNavigationAction
        icon={RightIcon}
        onPress={nextDate}
        style={nextButtonOpacity()}
        disabled={nextButtonOpacity().opacity !== 1}
      />
    </React.Fragment>
  );

  const changeFavorites = (vote, title, order) => {
    order ? toggleSecondMenu() : toggleMenu();
    setTitle(title);
    setSearch(`vote:${vote}:${user} order:${order}`);
  };

  const favActions = () => (
    <React.Fragment>
      <OverflowMenu anchor={renderFilterAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem key="1" title="Good only" accessoryLeft={StarIconGood} onPress={() => changeFavorites(1, 'Good')} />
        <MenuItem
          key="2"
          title="Great only"
          accessoryLeft={StarIconGreat}
          onPress={() => changeFavorites(2, 'Great')}
        />
        <MenuItem
          key="3"
          title="Favorite only"
          accessoryLeft={StarIconFav}
          onPress={() => changeFavorites(3, 'Favorites')}
        />
      </OverflowMenu>
      <OverflowMenu anchor={renderOptionsAction} visible={secondMenuVisible} onBackdropPress={toggleSecondMenu}>
        <MenuItem
          key="6"
          title="Sort by voted date"
          onPress={() => {
            if (title === 'Good') changeFavorites(1, 'Good', 'vote');
            if (title === 'Great') changeFavorites(2, 'Great', 'vote');
            if (title === 'Favorites') changeFavorites(3, 'Favorites', 'vote');
          }}
        />
        <MenuItem
          key="4"
          title="Sort by post date"
          onPress={() => {
            if (title === 'Good') changeFavorites(1, 'Good', 'date');
            if (title === 'Great') changeFavorites(2, 'Great', 'date');
            if (title === 'Favorites') changeFavorites(3, 'Favorites', 'date');
          }}
        />
        <MenuItem
          key="5"
          title="Sort by score"
          onPress={() => {
            if (title === 'Good') changeFavorites(1, 'Good', 'score');
            if (title === 'Great') changeFavorites(2, 'Great', 'score');
            if (title === 'Favorites') changeFavorites(3, 'Favorites', 'score');
          }}
        />
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

  const FormatSubtitle = () => {
    if (menuType === 'date') return formatDateForSearch(date);
    if (menuType === 'week') return `${formatDateForSearch(date)} - ${formatDateForSearch(secondDate)}`;
    if (menuType === 'month') return ` ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (menuType === 'year') return `${date.getFullYear()}`;
    return '';
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={formatTitle(title)}
          subtitle={FormatSubtitle()}
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
