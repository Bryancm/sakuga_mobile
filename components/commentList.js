import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { CommentItem } from './commentItem';
import { Icon, Layout, Button, Text } from '@ui-kitten/components';

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
    if (comment.isQuote)
      comment.body = '[quote]' + comment.creator + ' ' + 'said:' + '\n' + comment.body + '\n[/quote]\n\n';
    onEditCommentButtonPress(comment);
  };
  const renderItem = ({ item }) => (
    <CommentItem
      key={item.id.toString()}
      item={item}
      onEdit={onEdit}
      onDelete={onDeleteComment}
      onFlagComment={onFlagComment}
      user={user}
    />
  );
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      ref={commentList}
      data={data}
      renderItem={renderItem}
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
          <Layout level="2" style={styles.center}>
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
});
