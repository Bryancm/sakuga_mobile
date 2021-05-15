import React from 'react';
import { SafeAreaView, Image, StyleSheet, Keyboard } from 'react-native';
import { Divider, Icon, Layout, Input, Button, Text } from '@ui-kitten/components';
import { DetailHeader } from '../components/detailHeader';
import { TagList } from '../components/tagList';
import { DetailFooter } from '../components/detailFooter';
import { CommentList } from '../components/commentList';
import data from '../comment-data.json';

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
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const SendIcon = (props) => <Icon {...props} name="corner-down-right-outline" />;

export const DetailsScreen = ({ navigation, route }) => {
  const [inputIsFocused, setInputIsFocused] = React.useState(false);
  const [text, setText] = React.useState();
  const commentList = React.useRef();
  const item = route.params.item;
  const title = route.params.title;
  const tags = route.params.tags.slice(0, 7);

  const navigateBack = () => {
    navigation.goBack();
  };

  const cancelInput = () => {
    setText();
    setInputIsFocused(false);
    Keyboard.dismiss();
    commentList.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const CommentButtons = () => (
    <Layout style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
      {inputIsFocused && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="basic"
          appearance="ghost"
          accessoryRight={CloseIcon}
          onPress={cancelInput}
        />
      )}

      {inputIsFocused && (
        <Button
          style={{ paddingHorizontal: 0, paddingVertical: 0, height: 10 }}
          status="info"
          appearance="ghost"
          accessoryLeft={SendIcon}
        />
      )}
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

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Image source={{ uri: item.preview_url }} style={styles.image} resizeMode="contain" />

        <CommentList
          commentList={commentList}
          data={data}
          header={
            <Layout level="2">
              <DetailHeader title={title} style={styles.titleContainer} />
              <TagList tags={tags} style={styles.tagContainer} />
              <DetailFooter
                date={item.created_at}
                author={item.author}
                score={item.score}
                style={styles.titleContainer}
              />
              <Divider style={{ marginBottom: 12 }} />
              <Layout level="3" style={{ margin: 8, borderRadius: 2, padding: 0 }}>
                <Input
                  keyboardAppearance="dark"
                  multiline={true}
                  style={{ backgroundColor: 'transparent', minHeight: 40, maxHeight: 160, borderColor: 'transparent' }}
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
    paddingLeft: 6,
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
    paddingHorizontal: 8,
  },
  image: { width: '100%', height: 210, backgroundColor: '#000' },
});
