import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import data from '../test-data-v2.json';
import tag_data from '../test-tag-data.json';
import tag_copy_data from '../test-tag-copy-data.json';
import { PostHorizontalList } from '../components/postHorizontalList';
import { TagHorizontalList } from '../components/tagHorizontalList';
import { formatDateForSearch } from '../util/date';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ExploreScreen = ({ navigation }) => {
  const navigateSearch = () => {
    navigation.navigate('Search');
  };
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} onPress={navigateSearch} />;
  const currentDate = new Date();

  //day range
  const day = currentDate.getDate();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const today = `${year}-${month}-${day}`;
  const yesterday = `${year}-${month}-${day - 1}`;

  //week range
  const first = currentDate.getDate() - currentDate.getDay() + 1; // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6
  const firstday = new Date(currentDate.setDate(first));
  const lastday = new Date(currentDate.setDate(last));

  //month range
  const firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  //year range
  const currentYearDate = `${year}-01-01`;

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
              search={`date:${formatDateForSearch(firstday)}...${formatDateForSearch(lastday)} order:score`}
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
              search={`date:${currentYearDate}...${today} order:score`}
            />
          </ScrollView>
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
