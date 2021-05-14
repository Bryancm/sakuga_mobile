import React from 'react';
import { FlatList } from 'react-native';
import { CardSmall } from './cardSmall';
import { Card } from '../components/card';

export const PostVerticalList = ({ data, tags, layoutType, deleteAlert, navigateDetail }) => {
  const renderItem = ({ item }) =>
    layoutType === 'small' ? (
      <CardSmall
        key={item.id.toString()}
        item={item}
        tagsWithType={tags}
        deleteAlert={deleteAlert}
        navigateDetail={navigateDetail}
      />
    ) : (
      <Card
        key={item.id.toString()}
        item={item}
        tagsWithType={tags}
        deleteAlert={deleteAlert}
        navigateDetail={navigateDetail}
      />
    );
  return <FlatList data={data} renderItem={renderItem} windowSize={6} initialNumToRender={4} maxToRenderPerBatch={4} />;
};
