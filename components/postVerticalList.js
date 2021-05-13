import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { SmallCard } from '../components/smallCard';
import { Card } from '../components/card';

export const PostVerticalList = ({ data, tags, layoutType, deleteAlert }) => {
  const renderItem = ({ item }) =>
    layoutType === 'small' ? (
      <SmallCard key={item.id.toString()} item={item} tagsWithType={tags} deleteAlert={deleteAlert} />
    ) : (
      <Card key={item.id.toString()} item={item} tagsWithType={tags} deleteAlert={deleteAlert} />
    );
  return <FlatList data={data} renderItem={renderItem} windowSize={6} initialNumToRender={4} maxToRenderPerBatch={4} />;
};

const styles = StyleSheet.create({
  container: {},
});
