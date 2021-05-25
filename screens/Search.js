import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  Icon,
  Layout,
  Text,
  Button,
  Input,
  Tab,
  TabView,
  OverflowMenu,
  MenuItem,
  RangeDatepicker,
} from '@ui-kitten/components';

import tagData from '../tag_data.json';
import postData from '../test-data-v2.json';
import testData from '../test-tag-copy-data.json';

import { AutoComplete } from '../components/autoComplete';
import { PostVerticalList } from '../components/postVerticalList';
import { TagVerticalList } from '../components/tagVerticalList';

const LayoutIcon = (props) => <Icon {...props} name="layout-outline" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const FilterIcon = (props) => <Icon {...props} name="funnel-outline" />;
const ShuffleIcon = (props) => <Icon {...props} name="shuffle-outline" />;
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;

export const SearchScreen = ({ navigation }) => {
  const rangePicker = React.useRef();
  const [range, setRange] = React.useState({});
  const [value, setValue] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [layoutType, setLayoutType] = React.useState('large');
  const [sortType, setSortType] = React.useState('date');
  const [tagType, setTagType] = React.useState('all');
  const [tagSortType, setTagSortType] = React.useState('date');

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sortMenuVisible, setSortMenuVisible] = React.useState(false);
  const [tagTypeMenuVisible, setTagTypeMenuVisible] = React.useState(false);
  const [tagsortMenuVisible, setTagSortMenuVisible] = React.useState(false);

  const shouldLoadComponent = (index) => index === selectedIndex;
  const navigateBack = () => {
    navigation.goBack();
  };

  const onChangeText = (query) => {
    setValue(query);
    const splittedQuery = query.split(' ');
    const lastItem = splittedQuery[splittedQuery.length - 1];
    const d = testData.filter((t) => t.name.toLowerCase().includes(lastItem.toLowerCase()));
    setData(query ? d : []);
  };

  const onAutoCompletePress = (item) => {
    const splittedValue = value.split(' ');
    const index = splittedValue.length - 1;
    splittedValue[index] = item + ' ';
    setValue(splittedValue.join(' '));
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleSortMenu = () => {
    setSortMenuVisible(!sortMenuVisible);
  };
  const toggleMenuTagType = () => {
    setTagTypeMenuVisible(!tagTypeMenuVisible);
  };

  const toggleTagSortMenu = () => {
    setTagSortMenuVisible(!tagsortMenuVisible);
  };

  const changeLayout = (type) => {
    toggleMenu();
    setLayoutType(type);
  };

  const changeSort = (type) => {
    toggleSortMenu();
    setSortType(type);
  };

  const changeTagType = (type) => {
    toggleMenuTagType();
    setTagType(type);
  };
  const changeTagSort = (type) => {
    toggleTagSortMenu();
    setTagSortType(type);
  };

  const renderMenuAction = () => (
    <Button
      status="basic"
      appearance="ghost"
      accessoryLeft={LayoutIcon}
      style={{ paddingHorizontal: 0 }}
      onPress={toggleMenu}
    />
  );

  const renderSortMenuAction = () => (
    <Button
      status="basic"
      appearance="ghost"
      accessoryLeft={OptionsIcon}
      style={{ paddingHorizontal: 0 }}
      onPress={toggleSortMenu}
    />
  );

  const renderTagTypeAction = () => (
    <Button
      status="basic"
      appearance="ghost"
      accessoryLeft={FilterIcon}
      style={{ paddingVertical: 0 }}
      onPress={toggleMenuTagType}
    />
  );

  const renderTagSortAction = () => (
    <Button
      status="basic"
      appearance="ghost"
      accessoryLeft={OptionsIcon}
      style={{ paddingVertical: 0 }}
      onPress={toggleTagSortMenu}
    />
  );

  const LayoutActions = () => (
    <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
      <MenuItem title="Large list" onPress={() => changeLayout('large')} />
      <MenuItem title="Small list" onPress={() => changeLayout('small')} />
    </OverflowMenu>
  );

  const SortActions = () => (
    <OverflowMenu anchor={renderSortMenuAction} visible={sortMenuVisible} onBackdropPress={toggleSortMenu}>
      <MenuItem title="Sort by date" accessoryLeft={CalendarIcon} onPress={() => changeSort('date')} />
      <MenuItem title="Sort by score" accessoryLeft={StarIcon} onPress={() => changeSort('score')} />
      <MenuItem title="Shuffle" accessoryLeft={ShuffleIcon} onPress={() => changeSort('shuffle')} />
    </OverflowMenu>
  );

  const TagTypeActions = () => (
    <OverflowMenu anchor={renderTagTypeAction} visible={tagTypeMenuVisible} onBackdropPress={toggleMenuTagType}>
      <MenuItem title="Any" onPress={() => changeTagType('any')} />
      <MenuItem title="General" onPress={() => changeTagType('general')} />
      <MenuItem title="Artist" onPress={() => changeTagType('artist')} />
      <MenuItem title="Copyright" onPress={() => changeTagType('copyright')} />
      <MenuItem title="Terminology" onPress={() => changeTagType('terminology')} />
      <MenuItem title="Meta" onPress={() => changeTagType('meta')} />
    </OverflowMenu>
  );

  const TagSortActions = () => (
    <OverflowMenu anchor={renderTagSortAction} visible={tagsortMenuVisible} onBackdropPress={toggleTagSortMenu}>
      <MenuItem title="Sort by date" onPress={() => changeTagSort('date')} />
      <MenuItem title="Sort by count" onPress={() => changeTagSort('count')} />
      <MenuItem title="Sort by name" onPress={() => changeTagSort('name')} />
    </OverflowMenu>
  );

  const onRangeDateSelect = (nextRange) => {
    setRange(nextRange);
    if (nextRange.startDate && nextRange.endDate)
      setTimeout(() => {
        rangePicker.current.blur();
      }, 500);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flexDirection: 'row' }}>
          <Input
            style={{ padding: 8, width: '77%' }}
            size="small"
            status="basic"
            placeholder="Search"
            value={value}
            onChangeText={onChangeText}
          />
          <Button size="tiny" appearance="ghost" onPress={navigateBack} style={styles.cancelButton}>
            <Text status="info">Cancel</Text>
          </Button>
        </Layout>

        {data.length > 0 && <AutoComplete data={data} onPress={onAutoCompletePress} />}

        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          shouldLoadComponent={shouldLoadComponent}
          onSelect={(index) => setSelectedIndex(index)}>
          <Tab title="POST">
            <Layout style={styles.tabContainer}>
              <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <RangeDatepicker
                  placeholder="Date range"
                  ref={rangePicker}
                  style={{ marginTop: 5, marginLeft: 5 }}
                  size="small"
                  range={range}
                  max={new Date()}
                  onSelect={onRangeDateSelect}
                  accessoryLeft={CalendarIcon}
                />
                <Layout style={{ flexDirection: 'row' }}>
                  <LayoutActions />
                  <SortActions />
                </Layout>
              </Layout>
              <PostVerticalList data={postData.posts} tags={postData.tags} layoutType={layoutType} fromSearch={true} />
            </Layout>
          </Tab>

          <Tab title="TAGS">
            <Layout style={styles.tabContainer}>
              <Layout style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TagTypeActions />
                <TagSortActions />
              </Layout>
              <TagVerticalList data={tagData} />
            </Layout>
          </Tab>
        </TabView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cancelButton: {
    width: 80,
  },
});
