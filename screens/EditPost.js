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
  FlatList,
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
import { updatePost } from '../api/post';
import Toast from 'react-native-simple-toast';
import { postWithDetails } from '../util/post';
import { scale } from 'react-native-size-matters';
import Orientation from 'react-native-orientation-locker';

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

export const EditPostScreen = ({ route }) => {
  const { height, width } = useWindowDimensions();
  const { item, setItem } = route.params;
  var tags_string = '';
  item.tags.forEach((t) => {
    tags_string = tags_string + t.tag + ' ';
  });

  const scrollView = useRef();
  const [parent, setParent] = useState(item.parent_id ? `${item.parent_id}` : undefined);
  const [source, setSource] = useState(item.source);
  const [tags, setTags] = useState(tags_string);
  const [showInIndex, setShowInIndex] = useState(item.is_shown_in_index ? true : false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [relatedTags, setRelatedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [data, setData] = useState([]);
  const [relatedType, setRelatedType] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.addOrientationListener(cancelInput);
    return () => {
      Orientation.removeAllListeners();
    };
  }, []);

  const navigateLogin = () => {
    setEditLoading(false);
    navigation.navigate('Login', { from: 'EditPost' });
  };

  const editPostData = async () => {
    try {
      setEditLoading(true);
      const user = await getData('user');
      if (!user) return navigateLogin();
      const response = await updatePost({
        id: item.id,
        tags: tags,
        old_tags: tags_string,
        is_shown_in_index: showInIndex ? 1 : 0,
        parent_id: parent ? parent : '',
        user: user.name,
        password_hash: user.password_hash,
      });
      // console.log('RESPONSE: ', response);

      if (!response.success) {
        setEditLoading(false);
        return Toast.showWithGravity(response.reason, Toast.SHORT, Toast.CENTER);
      }
      const updatedPost = postWithDetails(response.tags, response.post);
      setItem(updatedPost);
      if (response.success) Toast.showWithGravity(`Success! Post Updated`, Toast.SHORT, Toast.CENTER);
      setEditLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log('EDIT_POST_ERROR: ', error);
      Toast.showWithGravity(`Error, Please try again later :(`, Toast.SHORT, Toast.CENTER);
      setEditLoading(false);
    }
  };

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

  const onChangeParent = (parent) => setParent(parent);
  const onChangeSource = (source) => setSource(source);
  const onChangeIndex = (showInIndex) => setShowInIndex(showInIndex);

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateHitory = () => {
    navigation.navigate('EditHistory', { item });
  };

  const renderBackAction = () => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />;

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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onChangeTags = (query) => {
    setTags(query);
    const splittedQuery = query.split(' ');
    const lastItem = splittedQuery[splittedQuery.length - 1];
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

  const updateRealtedTags = (type) => {
    setRelatedType(type ? capitalize(type) : 'All');
    toggleMenu();
    getRelated(type);
  };

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
    setIsFocused(true);
    scrollView.current.scrollToOffset({ animated: true, offset: 220 });
  };

  const cancelInput = () => {
    Keyboard.dismiss();
    scrollView.current.scrollToOffset({ animated: true, offset: 0 });
    if (isFocused) getRelated();
    setIsFocused(false);
  };

  const tagsCaption = () => (
    <Text appearance="hint" category="c1">
      Separate tags with spaces{' '}
      <Text status="primary" category="c1" onPress={openTagGuidelines}>
        (tag guidelines)
      </Text>
    </Text>
  );

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

  var renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={EditHistoryIcon} onPress={navigateHitory} />
      {editLoading ? <ActivityIndicator /> : <TopNavigationAction icon={SaveIcon} onPress={editPostData} />}
    </React.Fragment>
  );

  const scaleValue = width < 375 ? scale(140) : scale(220);

  const styleInput = { ...styles.input, width: Platform.isPad ? scaleValue : '100%' };
  const renderItem = ({ item, index }) => {
    return (
      <Layout style={{ width: Platform.isPad ? scaleValue : '100%', marginBottom: 8 }}>
        <Text category="s1" style={{ marginBottom: 8 }}>
          {item.name}
        </Text>
        {item.tags.map((t, i) => {
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
    );
  };

  const keyExtractor = (item) => item.name;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Edit Post"
          alignment="center"
          accessoryLeft={renderBackAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
        {isFocused && (
          <AutoComplete
            data={data}
            onPress={onAutoCompletePress}
            top={Platform.isPad ? 230 : 230}
            height={'34%'}
            width={Platform.isPad ? scaleValue : width * 0.95}
            alignItems={Platform.isPad ? 'center' : 'flex-start'}
          />
        )}
        <FlatList
          ref={scrollView}
          data={isFocused || loading ? [] : relatedTags}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ minHeight: height * 1.23, alignItems: Platform.isPad ? 'center' : 'stretch' }}
          keyboardShouldPersistTaps={isFocused ? 'always' : 'never'}
          scrollEnabled={isFocused ? false : true}
          windowSize={3}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          ListEmptyComponent={
            <Layout style={{ justifyContent: 'center', alignItems: 'center', height: '15%' }}>
              {!loading && !isFocused && (
                <Button accessoryRight={TagIcon} appearance="ghost" status="info" onPress={() => getRelated()}>
                  <Text category="s2" status="info">
                    View related tags
                  </Text>
                </Button>
              )}
              {loading && <ActivityIndicator color="#D4D4D4" />}
            </Layout>
          }
          ListHeaderComponent={
            <Layout>
              {/* <Layout
                style={{ ...styleInput, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text category="s2">Show in index</Text>
                <Toggle size="small" checked={showInIndex} onChange={onChangeIndex}></Toggle>
              </Layout> */}

              <Input
                label="Parent Post"
                size="large"
                autoCapitalize="none"
                keyboardType="numeric"
                placeholder="Post ID"
                keyboardAppearance="dark"
                style={styleInput}
                accessoryRight={HashIcon}
                value={parent}
                onChangeText={onChangeParent}
              />

              <Input
                label="Source"
                caption="Source of the media"
                size="large"
                autoCapitalize="none"
                placeholder="# EP"
                keyboardAppearance="dark"
                style={styleInput}
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
                keyboardAppearance="dark"
                value={tags}
                onChangeText={onChangeTags}
                accessoryRight={TagButtons}
                caption={tagsCaption}
                style={styleInput}
                onFocus={onFocus}
              />
              <Divider />
              {!isFocused && Object.keys(relatedTags).length > 0 && (
                <Layout
                  style={{
                    ...styleInput,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
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
                    <MenuItem
                      key="3"
                      onPress={() => updateRealtedTags('term')}
                      title={<Text category="c1">Terms</Text>}
                    />
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
                    <MenuItem
                      key="5"
                      onPress={() => updateRealtedTags('meta')}
                      title={<Text category="c1">Meta</Text>}
                    />
                  </OverflowMenu>
                </Layout>
              )}
            </Layout>
          }
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'stretch',
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
