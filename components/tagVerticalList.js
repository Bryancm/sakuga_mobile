import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { SmallCard } from '../components/uploadCard';
import { Tag } from '../components/tagItem';
import { ScrollView } from 'react-native-gesture-handler';

export const TagVerticalList = ({ data, navigation }) => {
  const renderItem = ({ item }) => <Tag key={item.id.toString()} tag={item} />;

  return (
    <FlatList
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingHorizontal: 2 }}
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
