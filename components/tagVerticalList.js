import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Tag } from '../components/tagItem';

export const TagVerticalList = ({ data }) => {
  const renderItem = ({ item }) => <Tag key={item.id.toString()} tag={item} />;

  return (
    <FlatList
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
