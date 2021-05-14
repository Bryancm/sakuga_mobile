import React from 'react';
import { FlatList } from 'react-native';
import { CommentItem } from './commentItem';

export const CommentList = ({ data, header }) => {
  const renderItem = ({ item }) => <CommentItem key={item.id.toString()} item={item} />;
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      windowSize={6}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      ListHeaderComponent={header}
    />
  );
};
