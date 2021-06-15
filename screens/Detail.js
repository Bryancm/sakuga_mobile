import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
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
import ImageView from 'react-native-image-viewing';

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
// const videoHeight = Math.round(screenHeight * 0.26 - 1);
const videoHeight = 233;

export const DetailsScreen = ({ navigation, route }) => {
  const mounted = useRef(true);
  const video = useRef();
  const commentList = useRef();
  const input = useRef();
  const item = route.params.item;
  // const [item, setItem] = useState(route.params.item);
  const title = route.params.title;
  const tags = route.params.tags;
  const isVideo =
    item.file_ext !== 'gif' && item.file_ext !== 'jpg' && item.file_ext !== 'jpeg' && item.file_ext !== 'png';

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
  const [fullScreen, setFullScreen] = useState(false);
  const [visible, setIsVisible] = useState(false);

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
      // console.log({ response });yarn
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
    if (!text || !text.trim()) return console.log('PLEASE TYPE A COMMENT'); // show toast
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

      {commentLoading && <ActivityIndicator color="#D4D4D4" />}
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
    setFullScreen(true);
    video.current.player.ref.presentFullscreenPlayer();
  };

  const onExitFullScreen = () => {
    setFullScreen(false);
    video.current.player.ref.dismissFullscreenPlayer();
  };

  const onFullscreenPlayerWillDismiss = () => {
    if (Platform.OS === 'ios') {
      video.current.methods.togglePlayPause();
      video.current.methods.toggleFullscreen();
    }
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

  const onImagePress = () => setIsVisible(true);

  const closeImageView = () => setIsVisible(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const onVideoError = (e) => {
    console.log('VIDEO_ERROR: ', e);
  };

  const seek = (seconds) => {
    if (videoLoaded) video.current.player.ref.seek(seconds);
  };

  const onLoad = () => {
    setVideoLoaded(true);
  };

  const sortComments = () => {
    if (commentSort === 'Newest') return comments.sort((a, b) => new Date(a.created_at) < new Date(b.created_at));
    return comments.reverse();
  };

  const sortedComments = sortComments(comments);

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {!isVideo && (
          <ImageView
            images={[{ uri: item.file_url }]}
            imageIndex={0}
            visible={visible}
            onRequestClose={closeImageView}
            swipeToCloseEnabled={false}
          />
        )}
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
                <ActivityIndicator color="#D4D4D4" />
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
          <Layout style={fullScreen ? styles.fullScreen : styles.image}>
            <VideoPlayer
              ref={video}
              paused={paused}
              source={{ uri: converProxyUrl(item.file_url) }}
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
              onExitFullscreen={onExitFullScreen}
              onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
              onError={onVideoError}
              onLoad={onLoad}
              fullscreen={fullScreen}
            />
          </Layout>
        )}
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
              <DetailHeader
                title={title}
                style={styles.titleContainer}
                url={converProxyUrl(item.file_url)}
                file_ext={item.file_ext}
                setPaused={setPaused}
                id={item.id}
                isVideo={isVideo}
                item={item}
              />
              <TagList tags={tags} style={styles.tagContainer} loadCount={true} />
              <DetailFooter item={item} style={styles.titleContainer} />
              <Divider style={{ marginBottom: 12 }} />
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
                status="basic"
                appearance="ghost"
                accessoryRight={SortIcon}
                style={{
                  width: 76,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text appearance="hint" category="c1" style={{ marginBottom: 8 }}>
                  Newest
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
  fullScreen: {
    width: '100%',
    height: '100%',
  },
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
});
