import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { CommentItem } from './commentItem';
import { Icon, Layout, Button, Text } from '@ui-kitten/components';

const screenHeight = Dimensions.get('window').height;

const PlusIcon = (props) => <Icon {...props} name="message-circle-outline" />;

export const CommentList = ({
  data,
  header,
  commentList,
  isFetching,
  refetch,
  isRefetching,
  onEditCommentButtonPress,
  onDeleteComment,
  onFlagComment,
  user,
}) => {
  const onEdit = (comment) => {
    const commentToEdit = { ...comment };
    if (commentToEdit.isQuote)
      commentToEdit.body =
        '[quote]' + commentToEdit.creator + ' ' + 'said:' + '\n' + commentToEdit.body + '\n[/quote]\n\n';
    onEditCommentButtonPress(commentToEdit);
  };
  const renderItem = ({ item }) => (
    <CommentItem item={item} onEdit={onEdit} onDelete={onDeleteComment} onFlagComment={onFlagComment} user={user} />
  );
  const keyExtractor = (item) => item.id.toString();
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      ref={commentList}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      windowSize={6}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      ListHeaderComponent={header}
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefetching} />}
      ListFooterComponent={
        isFetching &&
        !isRefetching && (
          <Layout level="2" style={styles.center}>
            <ActivityIndicator />
          </Layout>
        )
      }
      ListEmptyComponent={
        !isFetching && (
          <Layout level="2" style={styles.empty}>
            <Button size="giant" status="basic" appearance="ghost" accessoryRight={PlusIcon} />
            <Text appearance="hint" category="s1">
              No comments yet
            </Text>
          </Layout>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', height: 200, width: '100%' },
  empty: { alignItems: 'center', justifyContent: 'flex-start', height: screenHeight / 2.3, width: '100%' },
});
