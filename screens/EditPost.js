import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Linking,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import {
  Layout,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Input,
  Toggle,
  Text,
  OverflowMenu,
  MenuItem,
  Button,
  Divider,
} from '@ui-kitten/components';
import { AutoComplete } from '../components/autoComplete';
import { getData } from '../util/storage';
import { useNavigation } from '@react-navigation/native';
import { getRelatedTags, getTags } from '../api/tag';

const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const HashIcon = (props) => <Icon {...props} name="hash-outline" />;
const MonitorIcon = (props) => <Icon {...props} name="monitor-outline" />;
const TagIcon = (props) => <Icon {...props} name="pricetags-outline" />;
const FilterIcon = (props) => <Icon {...props} name="funnel-outline" />;
const CheckMarkIcon = (props) => <Icon {...props} name="checkmark-outline" />;

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const EditHistoryIcon = (props) => <Icon {...props} name="clock-outline" />;
const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const EditPost = ({ route }) => {
  const { height } = useWindowDimensions();
  const { item } = route.params;
  var tags_string = '';
  item.tags.forEach((t) => {
    tags_string = tags_string + t.tag + ' ';
  });

  const scrollView = useRef();
  const [parent, setParent] = useState(item.parent_id);
  const [source, setSource] = useState(item.source);
  const [tags, setTags] = useState(tags_string);
  const [showInIndex, setShowInIndex] = useState(item.is_shown_in_index ? true : false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [relatedTags, setRelatedTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [data, setData] = useState([]);
  const [relatedType, setRelatedType] = useState('All');
  const navigation = useNavigation();

  //   const loadUser = async () => {
  //     let newUser = false;
  //     const currentUser = await getData('user');
  //     if (currentUser && currentUser.name !== user) newUser = currentUser.name;
  //     setUser(newUser);
  //   };

  //   useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', async () => {
  //       loadUser();
  //     });
  //     return unsubscribe;
  //   }, [navigation]);

  const getRelated = async (type) => {
    try {
      setLoading(true);
      var relatedTags = [];
      const related = await getRelatedTags({ tags, type });
      const keys = Object.keys(related);
      for (const key of keys) {
        const tgs = related[key].map((t) => ({
          name: t[0],
          id: t[1],
          status: tags.includes(t[0]) ? 'primary' : 'basic',
        }));
        relatedTags.push({ name: key, tags: tgs });
      }
      setRelatedTags(relatedTags);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRelatedTags({});
    }
  };

  useEffect(() => {
    getRelated();
  }, []);

  const onChangeParent = (parent) => setParent(parent);
  const onChangeSource = (source) => setSource(source);
  // const onChangeTags = (tags) => setTags(tags);
  const onChangeIndex = (showInIndex) => setShowInIndex(showInIndex);

  const navigateBack = () => {
    navigation.goBack();
  };

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const openUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openTagGuidelines = () => openUrl('https://www.sakugabooru.com/wiki/show?title=tag_guidelines');

  const tagsCaption = () => (
    <Text appearance="hint" category="c2">
      Separate tags with spaces{' '}
      <Text status="primary" category="c2" onPress={openTagGuidelines}>
        (tag guidelines)
      </Text>
    </Text>
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const menuAnchor = () => (
    <Button
      size="small"
      style={{ paddingHorizontal: 0 }}
      status="basic"
      appearance="ghost"
      accessoryLeft={FilterIcon}
      onPress={toggleMenu}>
      <Text appearance="hint" category="s2">
        {relatedType}
      </Text>
    </Button>
  );

  const updateTags = (relatedTag, index, relatedIndex) => {
    var newTags = tags;
    var newRelatedTags = relatedTags;

    if (tags.includes(relatedTag.name)) {
      newTags = newTags.replace(`${relatedTag.name} `, '');
      newRelatedTags[relatedIndex].tags[index].status = 'basic';
    } else {
      newTags = newTags + relatedTag.name + ' ';
      newRelatedTags[relatedIndex].tags[index].status = 'primary';
    }

    setTags(newTags);
    setRelatedTags(newRelatedTags);
  };

  const onFocus = (e) => {
    setRelatedTags([]);
    setIsFocused(true);
    scrollView.current.scrollTo({ y: 270, animated: true });
  };

  const cancelInput = () => {
    setIsFocused(false);
    Keyboard.dismiss();
    scrollView.current.scrollTo({ y: 0, animated: true });
    getRelated();
  };

  const TagButtons = () => (
    <Layout style={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {isFocused && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="basic"
          appearance="ghost"
          accessoryRight={CheckMarkIcon}
          onPress={cancelInput}
        />
      )}
      {!isFocused && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="basic"
          appearance="ghost"
          accessoryRight={TagIcon}
        />
      )}
    </Layout>
  );

  const onChangeTags = (query) => {
    setTags(query);
    const splittedQuery = query.split(' ');
    const lastItem = splittedQuery[splittedQuery.length - 1];
    // if (!query) setRange({});
    getTags({ name: lastItem.toLowerCase(), order: 'count', limit: 10 })
      .then((d) => {
        query ? setData(d) : setData([]);
      })
      .catch((e) => {
        console.log('CHANGE_SEARCH_TEXT_ERROR: ', e);
        setData([]);
      });
  };

  const onAutoCompletePress = (tag) => {
    const splittedValue = tags ? tags.split(' ') : [];
    const index = tags ? splittedValue.length - 1 : 0;
    splittedValue[index] = tag + ' ';
    setTags(splittedValue.join(' '));
  };

  var renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={EditHistoryIcon} />
      <TopNavigationAction icon={SaveIcon} />
    </React.Fragment>
  );

  const updateRealtedTags = (type) => {
    setRelatedType(type ? capitalize(type) : 'All');
    toggleMenu();
    getRelated(type);
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Edit Post"
          alignment="center"
          accessoryLeft={renderBackAction}
          accessoryRight={renderRightActions}
        />
        {isFocused && <AutoComplete data={data} onPress={onAutoCompletePress} top={270} height={'34%'} />}
        <ScrollView
          ref={scrollView}
          contentContainerStyle={{ minHeight: height * 1.5 }}
          keyboardShouldPersistTaps={isFocused ? 'always' : 'never'}
          scrollEnabled={isFocused ? false : true}>
          <Layout
            style={{ ...styles.input, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text category="s2">Show in index</Text>
            <Toggle size="small" checked={showInIndex} onChange={onChangeIndex}></Toggle>
          </Layout>
          <Divider />
          <Input
            label="Parent Post"
            size="large"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholder="Post ID"
            keyboardAppearance="dark"
            style={styles.input}
            accessoryRight={HashIcon}
            value={parent}
            onChangeText={onChangeParent}
          />

          {/* <CheckBox
              checked={showInIndex}
              onChange={onChangeIndex}
              style={{ ...styles.input, width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <Text appearance="hint" category="s2">
                Show in index
              </Text>
            </CheckBox> */}

          <Input
            label="Source"
            caption="Source of the media"
            size="large"
            autoCapitalize="none"
            placeholder="# EP"
            keyboardAppearance="dark"
            style={styles.input}
            accessoryRight={MonitorIcon}
            value={source}
            onChangeText={onChangeSource}
          />

          <Input
            multiline={true}
            label="Tags"
            size="large"
            placeholder="Tags"
            autoCorrect={false}
            // clearButtonMode="always"
            enablesReturnKeyAutomatically={true}
            keyboardAppearance="dark"
            value={tags}
            onChangeText={onChangeTags}
            accessoryRight={TagButtons}
            caption={tagsCaption}
            style={styles.input}
            onFocus={onFocus}
          />
          <Divider />
          {!isFocused && (
            <Layout
              style={{ ...styles.input, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text appearance="hint" category="s2">
                Related tags
              </Text>
              <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
                <MenuItem key="1" onPress={() => updateRealtedTags()} title={<Text category="c1">All</Text>} />
                <MenuItem
                  key="2"
                  onPress={() => updateRealtedTags('artist')}
                  title={<Text category="c1">Artist</Text>}
                />
                <MenuItem key="3" onPress={() => updateRealtedTags('term')} title={<Text category="c1">Terms</Text>} />
                <MenuItem
                  key="4"
                  onPress={() => updateRealtedTags('copyright')}
                  title={<Text category="c1">Copyright</Text>}
                />
                <MenuItem
                  key="6"
                  onPress={() => updateRealtedTags('general')}
                  title={<Text category="c1">General</Text>}
                />
                <MenuItem key="5" onPress={() => updateRealtedTags('meta')} title={<Text category="c1">Meta</Text>} />
              </OverflowMenu>
            </Layout>
          )}
          {loading && (
            <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </Layout>
          )}
          {!loading && !isFocused && (
            <Layout>
              {relatedTags.map((tag, index) => (
                <Layout key={tag.name} style={{ marginBottom: 8 }}>
                  <Text category="s1" style={{ marginBottom: 8 }}>
                    {tag.name}
                  </Text>
                  {tag.tags.map((t, i) => {
                    const update = () => updateTags(t, i, index);
                    return (
                      <Button
                        key={i}
                        size="small"
                        appearance="ghost"
                        onPress={update}
                        status={t.status}
                        accessoryRight={TagIcon}
                        style={{ justifyContent: 'flex-start' }}>
                        <Text category="c1" style={{ marginVertical: 4 }} status={t.status}>
                          {t.name}
                        </Text>
                      </Button>
                    );
                  })}
                </Layout>
              ))}
            </Layout>
          )}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: Platform.isPad ? 'center' : 'stretch',
    position: 'relative',
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginVertical: 12,
    width: Platform.isPad ? scale(220) : '100%',
  },
});
