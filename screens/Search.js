import React, { useState, useEffect, useRef } from 'react';
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
import { getTags } from '../api/tag';
import { storeData, getData } from '../util/storage';
import { formatDateForSearch } from '../util/date';
import tagData from '../tag_data.json';

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
  const rangePicker = useRef();
  const [range, setRange] = useState({});
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]); // init with search history
  const [focus, setFocus] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [layoutType, setLayoutType] = useState('small');
  const [sortType, setSortType] = useState('date');
  const [tagType, setTagType] = useState('all');
  const [tagSortType, setTagSortType] = useState('date');

  const [menuVisible, setMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [tagTypeMenuVisible, setTagTypeMenuVisible] = useState(false);
  const [tagsortMenuVisible, setTagSortMenuVisible] = useState(false);

  const initData = async () => {
    try {
      const currentHistory = await getData('tagHistory');
      const newData = await getTags({});
      currentHistory ? setData([...currentHistory, ...newData]) : setData(newData);
    } catch (error) {
      console.log('ERROR_INIT_DATA: ', error);
    }
  };

  useEffect(() => {
    setAutoFocus(false);
    initData();
  }, []);

  const shouldLoadComponent = (index) => index === selectedIndex;
  const navigateBack = () => {
    navigation.goBack();
  };

  const onChangeText = (query) => {
    setValue(query);
    const splittedQuery = query.split(' ');
    const lastItem = splittedQuery[splittedQuery.length - 1];
    if (!query) setRange({});
    getTags({ name: lastItem.toLowerCase(), order: 'count' })
      .then((d) => {
        query ? setData(d) : initData();
      })
      .catch((e) => {
        console.log('CHANGE_SEARCH_TEXT_ERROR: ', e);
        initData();
      });
  };

  const onAutoCompletePress = (tag) => {
    const splittedValue = value ? value.split(' ') : [];
    const index = value ? splittedValue.length - 1 : 0;
    splittedValue[index] = tag + ' ';
    setValue(splittedValue.join(' '));
  };

  const submitSearch = () => {
    setFocus(false);
    setSearch(value.toLowerCase().trim());
    saveInHistory(value.toLowerCase().trim());
    setRange({});
    initData();
  };

  const saveInHistory = async (value) => {
    const historyItem = {
      id: new Date().valueOf(),
      name: value,
      count: 0,
      type: -1,
      ambiguous: false,
      isHistory: true,
    };
    var newHistory = [];
    const currentHistory = await getData('tagHistory');
    if (currentHistory) {
      const filteredHistory = currentHistory.filter((i) => i.name !== historyItem.name);
      newHistory = [historyItem, ...filteredHistory];
    } else {
      newHistory = [historyItem];
    }
    storeData('tagHistory', newHistory.slice(0, 9));
  };

  const deleteItemFromHistory = async (id) => {
    const currentHistory = await getData('tagHistory');
    const filteredHistory = currentHistory.filter((i) => i.id !== id);
    storeData('tagHistory', filteredHistory);
    initData();
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

  const changeSort = (order) => {
    toggleSortMenu();
    setSortType(order);
    let newSearch = value.toLowerCase().trim() + ` order:${order}`;
    if (range.startDate && range.endDate) {
      newSearch = newSearch + ` date:${formatDateForSearch(range.startDate)}...${formatDateForSearch(range.endDate)}`;
    }
    setSearch(newSearch);
  };

  const changeTagType = (type) => {
    toggleMenuTagType();
    setTagType(type);
  };
  const changeTagSort = (order) => {
    toggleTagSortMenu();
    setTagSortType(order);
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
      <MenuItem title="Shuffle" accessoryLeft={ShuffleIcon} onPress={() => changeSort('random')} />
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
        const v = value.toLowerCase().trim();
        let s = v + ` date:${formatDateForSearch(nextRange.startDate)}...${formatDateForSearch(nextRange.endDate)}`;
        s = s + ` order:${sortType}`;
        setSearch(s);
      }, 500);
  };

  const onFocus = () => {
    setFocus(true);
  };

  const cleanRange = () => {
    setRange({});
    const newSearch = `${value.toLowerCase().trim()} order:${sortType}`;
    setSearch(newSearch);
  };

  const CloseIcon = (props) => <Icon {...props} name="close-outline" onPress={cleanRange} />;

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
            onSubmitEditing={submitSearch}
            autoCorrect={false}
            autoFocus={autoFocus}
            clearButtonMode="always"
            enablesReturnKeyAutomatically={true}
            keyboardAppearance="dark"
            returnKeyType="search"
            onFocus={onFocus}
          />
          <Button size="tiny" appearance="ghost" onPress={navigateBack} style={styles.cancelButton}>
            <Text status="info">Cancel</Text>
          </Button>
        </Layout>
        {focus && (
          <AutoComplete data={data} onPress={onAutoCompletePress} deleteItemFromHistory={deleteItemFromHistory} />
        )}
        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          shouldLoadComponent={shouldLoadComponent}
          onSelect={(index) => setSelectedIndex(index)}>
          <Tab title="POST">
            <Layout style={styles.tabContainer}>
              <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <RangeDatepicker
                  placeholder="Select a date range"
                  ref={rangePicker}
                  style={{
                    marginTop: 5,
                    marginLeft: 5,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}
                  size="small"
                  range={range}
                  min={new Date(1356998400 * 1000)}
                  max={new Date()}
                  onSelect={onRangeDateSelect}
                  accessoryLeft={CalendarIcon}
                  accessoryRight={range.startDate && range.endDate && CloseIcon}
                  clearButtonMode="always"
                />
                <Layout style={{ flexDirection: 'row' }}>
                  <LayoutActions />
                  <SortActions />
                </Layout>
              </Layout>
              <PostVerticalList layoutType={layoutType} fromSearch={true} search={search} focus={focus} />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
  },
});
