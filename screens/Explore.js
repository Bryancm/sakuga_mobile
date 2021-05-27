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
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;

  const currentDate = new Date();
  const today = formatDateForSearch(currentDate);
  const yesterday = formatDateForSearch(getYesterdayDate(currentDate));

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
            <PostHorizontalList title="Trending" menuType="date" search={`date:${yesterday}...${today} order:score`} />
            <TagHorizontalList title="New Artist" data={tag_data} navigation={navigation} menuType="tag" />
            <PostHorizontalList
              title="Week's Popular"
              menuType="week"
              search={`date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`}
            />
            <PostHorizontalList title="Character Acting" menuType="post" search="character_acting" />
            <TagHorizontalList title="New Copyright" data={tag_copy_data} navigation={navigation} menuType="tag" />
            <PostHorizontalList
              title="Month's Popular"
              menuType="month"
              search={`date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`}
            />
            <PostHorizontalList title="Fighting" menuType="post" search="fighting" />
            <TagHorizontalList title="Popular Artist" data={tag_data} navigation={navigation} menuType="tag" />
            <PostHorizontalList title="Liquid" menuType="post" search="liquid" />
            <PostHorizontalList title="Explosions" menuType="post" search="explosions" />
            <TagHorizontalList title="Popular Copyright" data={tag_copy_data} navigation={navigation} menuType="tag" />
            <PostHorizontalList title="Hair" menuType="post" search="hair" />
            <PostHorizontalList title="Production Materials" menuType="post" search="production_materials" />
            <PostHorizontalList
              title="Year's Popular"
              menuType="year"
              search={`date:${formatDateForSearch(firstDayYear)}...${today} order:score`}
            />
          </ScrollView>
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
