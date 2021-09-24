import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { Divider, Icon, Layout, Input, Button, Text } from '@ui-kitten/components';
import { DetailHeader } from '../components/detailHeader';
import { TagList } from '../components/tagList';
import { DetailFooter } from '../components/detailFooter';
import { CommentList } from '../components/commentList';
import { storeData, getData } from '../util/storage';
import { getComments, addComment, editComment, deleteComment, flagComment } from '../api/comment';
import Toast from 'react-native-simple-toast';
import VideoPlayer from 'react-native-video-controls';
import converProxyUrl from 'react-native-video-cache';
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import { verticalScale } from 'react-native-size-matters';
import { useDeviceOrientationChange, useOrientationChange } from 'react-native-orientation-locker';
import { findTag } from '../api/tag';

const SortIcon = () => (
  <Icon
    name="code-outline"
    style={{
      width: 14,
      height: 14,
      transform: [{ rotate: '90deg' }],
    }}
    fill="#808080"
  />
);
const ArrowDown = (props) => <Icon {...props} name="arrow-ios-downward-outline" fill="#D4D4D4" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const SendIcon = (props) => <Icon {...props} name="corner-down-right-outline" />;

const videoHeight = Platform.isPad ? verticalScale(280) : verticalScale(232);

export const DetailsScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

  const mounted = useRef(true);
  const video = useRef();
  const commentList = useRef();
  const input = useRef();
  const originalItem = route.params.item;
  const [item, setItem] = useState(route.params.item);
  // const [item, setItem] = useState(route.params.item);
  const title = route.params.title;
  // const tags = route.params.tags;
  const isVideo =
    item.file_ext !== 'gif' && item.file_ext !== 'jpg' && item.file_ext !== 'jpeg' && item.file_ext !== 'png';

  const [orientation, setOrientation] = useState('');
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [text, setText] = useState();
  const [comments, setComments] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [isRefetching, setRefetching] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editId, setEditId] = useState(false);
  const [user, setUser] = useState();
  const [paused, setPaused] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [commentSort, setCommentSort] = useState('Newest');
  const [url, setUrl] = useState(converProxyUrl(item.file_url));
  const [tags, setTags] = useState(route.params.tags);

  const getTagCount = async () => {
    try {
      var tagFetches = [];
      var newTags = [];
      for (const tag of tags) {
        tagFetches.push(findTag({ name: tag.tag }));
      }
      const responses = await Promise.all(tagFetches);
      for (let index = 0; index < responses.length; index++) {
        const response = responses[index];
        const responseTag = response.find((t) => t.name === tags[index].tag);
        const newTag = { ...tags[index], count: responseTag.count };
        newTags.push(newTag);
      }
      setTags(newTags);
    } catch (error) {
      console.log('GET_TAG_COUNT_ERROR: ', error);
    }
  };

  useOrientationChange((orientation) => {
    // console.log(orientation);
    setOrientation(orientation);
  });

  const navigateLogin = () => {
    setPaused(true);
    clearLoading();
    navigation.navigate('Login');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setPaused(false);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', async () => {
      setPaused(true);
    });
    return unsubscribe;
  }, [navigation]);

  const loadUser = async () => {
    let newUser = false;
    const currentUser = await getData('user');
    if (currentUser && currentUser.name !== user) newUser = currentUser.name;
    setUser(newUser);
  };

  const updatePostHistory = async () => {
    try {
      var newHistory = [item];
      const currentHistory = await getData('postHistory');
      if (currentHistory) {
        const filteredHistory = currentHistory.filter((p) => p.id !== item.id);
        newHistory = [item, ...filteredHistory];
      }
      await storeData('postHistory', newHistory);
    } catch (error) {
      console.log('ADD_TO_HISTORY_ERROR: ', error);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments({ id: item.id });
      setComments(data);
      clearLoading();
    } catch (error) {
      console.log('FETCH_COMMENTS_ERROR: ', error);
      setComments([]);
      clearLoading();
    }
  };

  const clearLoading = () => {
    setFetching(false);
    setRefetching(false);
    setCommentLoading(false);
  };

  const refetchComments = () => {
    setRefetching(true);
    fetchComments();
  };

  const addPostComment = async () => {
    try {
      setCommentLoading(true);
      const user = await getData('user');
      if (!user) return navigateLogin();

      // const body = text.replace(/\n/g, '%0D%0A');
      const response = await addComment({
        id: item.id,
        body: text,
        user: user.name,
        password_hash: user.password_hash,
      });
      // console.log({ response });
      fetchComments();
      cancelInput();
      // Toast.show('Comment added');
      Toast.showWithGravity(`Comment added`, Toast.SHORT, Toast.CENTER);
    } catch (error) {
      console.log('ADD COMMENT ERROR', error);
      clearLoading();
      Toast.show('Error, please try again later :(');
    }
  };

  const editPostComment = async (id) => {
    try {
      setCommentLoading(true);
      const user = await getData('user');
      if (!user) return navigateLogin();
      const body = text.replace(/\n/g, '%0D%0A');
      const response = await editComment({ id, body, user: user.name, password_hash: user.password_hash });
      // console.log({ response });
      fetchComments();
      cancelInput();
      // Toast.show('Comment edited');
      Toast.showWithGravity(`Comment edited`, Toast.SHORT, Toast.CENTER);
    } catch (error) {
      console.log('EDIT COMMENT ERROR', error);
      clearLoading();
      Toast.show('Error, please try again later :(');
    }
  };

  const onCommentButtonPress = () => {
    if (!text || !text.trim()) return Toast.showWithGravity(`Please type a comment`, Toast.SHORT, Toast.CENTER);
    editId ? editPostComment(editId) : addPostComment();
  };

  const onEditCommentButtonPress = ({ id, body, isQuote }) => {
    setEditId(false);
    if (!isQuote) setEditId(id);
    setText(body);
    input.current.focus();
  };

  const deleteCommentAlert = (id) => {
    Alert.alert('Delete', `Do you want to delete this comment ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Confirm', onPress: () => onDeleteComment(id), style: 'destructive' },
    ]);
  };

  const onDeleteComment = async (id) => {
    try {
      setFetching(true);
      setComments([]);
      const user = await getData('user');
      if (!user) return navigateLogin();
      const response = await deleteComment({ id, user: user.name, password_hash: user.password_hash });
      // console.log({ response });
      fetchComments();
      // Toast.show('Comment deleted');
      Toast.showWithGravity(`Comment deleted`, Toast.SHORT, Toast.CENTER);
    } catch (error) {
      console.log('DELETE COMMENT ERROR', error);
      clearLoading();
      Toast.show('Error, please try again later :(');
    }
  };

  const flagCommentAlert = (id) => {
    Alert.alert('Flag', `Do you want to flag for delete this comment ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Confirm', onPress: () => onFlagComment(id), style: 'destructive' },
    ]);
  };

  const onFlagComment = async (id) => {
    try {
      setFetching(true);
      setComments([]);
      const user = await getData('user');
      if (!user) return navigateLogin();
      const response = await flagComment({ id, user: user.name, password_hash: user.password_hash });
      // console.log({ response });
      fetchComments();
      // Toast.show('Comment flaged for delete');
      Toast.showWithGravity(`Comment flaged for delete`, Toast.SHORT, Toast.CENTER);
    } catch (error) {
      console.log('DELETE COMMENT ERROR', error);
      clearLoading();
      Toast.show('Error, please try again later :(');
    }
  };

  useEffect(() => {
    mounted.current = true;
    loadUser();
    updatePostHistory();
    fetchComments();
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) getTagCount();
  }, [tags]);

  const cancelInput = () => {
    setText();
    setInputIsFocused(false);
    Keyboard.dismiss();
    commentList.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const CommentButtons = () => (
    <Layout style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
      {inputIsFocused && !commentLoading && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="basic"
          appearance="ghost"
          accessoryRight={CloseIcon}
          onPress={cancelInput}
        />
      )}

      {inputIsFocused && !commentLoading && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="info"
          appearance="ghost"
          accessoryLeft={SendIcon}
          onPress={onCommentButtonPress}
        />
      )}

      {commentLoading && <ActivityIndicator />}
    </Layout>
  );

  const onInputFocus = () => {
    commentList.current.scrollToOffset({ animated: true, offset: 185 });
    setInputIsFocused(true);
  };

  const onChangeText = (text) => {
    if (!text) cancelInput();
    setText(text);
  };

  const onEnterFullscreen = () => {
    video.current.player.ref.presentFullscreenPlayer();
  };

  const onFullscreenPlayerWillDismiss = () => {
    video.current.methods.togglePlayPause();
    video.current.methods.toggleFullscreen();
  };

  const download = async () => {
    try {
      setLoadingImage(true);
      const {
        dirs: { DownloadDir, DocumentDir },
      } = RNFetchBlob.fs;
      const directoryPath = Platform.select({
        ios: DocumentDir,
        android: DownloadDir,
      });
      const fileExt = item.file_ext;
      const isIOS = Platform.OS === 'ios';
      const filePath = `${directoryPath}/${item.title}_${item.id}.${fileExt}`;
      const isVideo = fileExt !== 'gif' && fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'png';
      const mimeType = isVideo ? 'video/*' : 'image/*';
      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: filePath,
          notification: true,
        },
        android: {
          fileCache: true,
          path: filePath,
          addAndroidDownloads: {
            useDownloadManager: true,
            mime: mimeType,
            title: item.title,
            mediaScannable: true,
            notification: true,
          },
        },
      });
      const response = await RNFetchBlob.config(configOptions).fetch('GET', item.file_url);
      if (isIOS) RNFetchBlob.ios.openDocument(response.path());
      setLoadingImage(false);
    } catch (error) {
      Toast.show('Error, please try again later :(');
      console.log('download error: ', error);
      setLoadingImage(false);
    }
  };

  const onImagePress = () => {
    download();
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const onVideoError = (e) => {
    console.log('VIDEO_ERROR: ', e);
    if (e.error.code === -11828) {
      convertToMP4();
    }
  };

  const convertToMP4 = async () => {
    try {
      const directory = `${RNFS.CachesDirectoryPath}/webmCache`;
      const exist = await RNFS.exists(directory);
      if (exist) await RNFS.unlink(directory);
      await RNFS.mkdir(directory);
      const fileName = `${directory}/${item.id}.mp4`;
      // const command = `-fflags +genpts -i ${url} -r 24 ${fileName}`;
      const command = `-i ${url} -strict experimental ${fileName}`;
      // const command = `-i ${url} -strict experimental -c copy ${fileName}`;
      await RNFFmpeg.execute(command);
      setUrl(fileName);
    } catch (error) {
      console.log('CONVERT_TO_MP4_ERROR: ', error);
      // setUrl('format incompatible');
    }
  };

  const seek = (seconds) => {
    if (videoLoaded) video.current.player.ref.seek(seconds);
  };

  const onLoad = () => {
    setVideoLoaded(true);
  };

  const changeCommentSort = () => {
    if (commentSort === 'Newest') return setCommentSort('Oldest');
    setCommentSort('Newest');
  };

  const sortComments = () => {
    if (commentSort === 'Newest') return comments.sort((a, b) => new Date(a.created_at) < new Date(b.created_at));
    return comments.reverse();
  };

  const sortedComments = sortComments(comments);

  const isLandscape = width >= 592 && orientation.includes('LANDSCAPE');

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column' }}>
        <Layout level="2" style={{ width: isLandscape ? '65%' : '100%' }}>
          {!isVideo && (
            <TouchableOpacity delayPressIn={0} delayPressOut={0} activeOpacity={0.7} onPress={onImagePress}>
              <Button appearance="ghost" accessoryRight={ArrowDown} style={styles.closeButton} onPress={navigateBack} />
              {loadingImage && (
                <Layout
                  style={{
                    ...styles.image,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                    opacity: 0.7,
                  }}>
                  <ActivityIndicator />
                </Layout>
              )}
              <FastImage
                source={{ uri: item.file_url }}
                style={styles.image}
                resizeMode="contain"
                onLoadEnd={() => setLoadingImage(false)}
              />
            </TouchableOpacity>
          )}
          {isVideo && (
            <Layout style={styles.image}>
              <VideoPlayer
                ref={video}
                paused={paused}
                source={{ uri: url }}
                navigator={navigation}
                controlAnimationTiming={250}
                controlTimeout={3000}
                scrubbing={1}
                repeat={true}
                muted={true}
                disableVolume={true}
                toggleResizeModeOnFullscreen={false}
                controls={false}
                seekColor="#C3070B"
                onEnterFullscreen={onEnterFullscreen}
                onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
                // onError={onVideoError}
                onLoad={onLoad}
              />
            </Layout>
          )}
          {isLandscape && (
            <DetailHeader
              title={title}
              style={styles.titleContainer}
              url={url}
              file_ext={item.file_ext}
              setPaused={setPaused}
              id={item.id}
              isVideo={isVideo}
              item={item}
            />
          )}

          {isLandscape && <TagList tags={tags} style={styles.tagContainer} loadCount={false} item={item} />}

          {isLandscape && <DetailFooter item={item} style={styles.titleContainer} />}
        </Layout>
        <CommentList
          commentList={commentList}
          data={user === undefined ? [] : sortedComments}
          isFetching={isFetching}
          isRefetching={isRefetching}
          refetch={refetchComments}
          onEditCommentButtonPress={onEditCommentButtonPress}
          onDeleteComment={deleteCommentAlert}
          onFlagComment={flagCommentAlert}
          user={user}
          seek={seek}
          header={
            <Layout level="2">
              {!isLandscape && (
                <DetailHeader
                  title={title}
                  style={styles.titleContainer}
                  url={url}
                  file_ext={item.file_ext}
                  setPaused={setPaused}
                  id={item.id}
                  isVideo={isVideo}
                  item={item}
                  setItem={setItem}
                  setTags={setTags}
                />
              )}
              {!isLandscape && <TagList tags={tags} style={styles.tagContainer} loadCount={true} />}
              {!isLandscape && <DetailFooter item={item} style={styles.titleContainer} />}
              {!isLandscape && <Divider style={{ marginBottom: 12 }} />}
              <Layout level="3" style={{ margin: 8, borderRadius: 2, padding: 0 }}>
                <Input
                  ref={input}
                  keyboardAppearance="dark"
                  multiline={true}
                  style={{
                    backgroundColor: 'transparent',
                    minHeight: 40,
                    maxHeight: 160,
                    borderColor: 'transparent',
                  }}
                  placeholder="Add a comment"
                  accessoryRight={CommentButtons}
                  onFocus={onInputFocus}
                  onChangeText={onChangeText}
                  value={text}
                />
              </Layout>
              <Button
                delayPressIn={0}
                delayPressOut={0}
                status="basic"
                appearance="ghost"
                accessoryRight={SortIcon}
                onPress={changeCommentSort}
                style={{
                  width: 76,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text appearance="hint" category="c1" style={{ marginBottom: 8 }}>
                  {commentSort}
                </Text>
              </Button>
            </Layout>
          }
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    paddingLeft: 8,
    paddingTop: 0,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  image: { width: '100%', height: videoHeight },
  closeButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 10,
    top: 10,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 25,
    backgroundColor: '#000',
    opacity: 0.7,
    zIndex: 10,
  },
  url: { color: '#2980b9' },
  text: { fontSize: 12, color: '#808080' },
});
