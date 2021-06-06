import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import data from '../test-data-v2.json';
import tag_data from '../test-tag-data.json';
import tag_copy_data from '../test-tag-copy-data.json';
import { PostHorizontalList } from '../components/postHorizontalList';
import { TagHorizontalList } from '../components/tagHorizontalList';
import { formatDateForSearch, getYesterdayDate, getWeekDate, getMonthDate, getYearDate } from '../util/date';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ExploreScreen = ({ navigation }) => {
  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const renderSearchAction = () => (
    <TopNavigationAction delayPressIn={0} delayPressOut={0} icon={SearchIcon} onPress={navigateSearch} />
  );

  const currentDate = new Date();
  const today = formatDateForSearch(currentDate);
  // const yesterday = formatDateForSearch(getYesterdayDate(currentDate));

  const { firstDayWeek, lastDayWeek } = getWeekDate(currentDate);
  const { firstDayMonth, lastDayMonth } = getMonthDate(currentDate);
  const { firstDayYear } = getYearDate(currentDate.getFullYear());

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Explore" alignment="center" accessoryRight={renderSearchAction} />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PostHorizontalList
              title="Day's popular"
              menuType="date"
              search={`date:${today} order:score`}
              date={currentDate}
            />
            <TagHorizontalList title="New Artist" menuType="tag" type="1" order="date" />
            <PostHorizontalList
              title="Week's Popular"
              menuType="week"
              search={`date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`}
              date={firstDayWeek}
              secondDate={lastDayWeek}
            />
            <PostHorizontalList title="Character Acting" menuType="post" search="character_acting" />
            <TagHorizontalList title="New Copyright" menuType="tag" type="3" order="date" />
            <PostHorizontalList
              title="Month's Popular"
              menuType="month"
              search={`date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`}
              date={firstDayMonth}
              secondDate={lastDayMonth}
            />
            <PostHorizontalList title="Fighting" menuType="post" search="fighting" />
            <TagHorizontalList title="Popular Artist" menuType="tag" type="1" order="count" />
            <PostHorizontalList title="Liquid" menuType="post" search="liquid" />
            <PostHorizontalList title="Explosions" menuType="post" search="explosions" />
            <TagHorizontalList title="Popular Copyright" menuType="tag" type="3" order="count" />
            <PostHorizontalList title="Hair" menuType="post" search="hair" />
            <PostHorizontalList title="Production Materials" menuType="post" search="production_materials" />
            <PostHorizontalList
              title="Year's Popular"
              menuType="year"
              search={`date:${formatDateForSearch(firstDayYear)}...${today} order:score`}
              date={currentDate}
              secondDate={firstDayYear}
            />
          </ScrollView>
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
