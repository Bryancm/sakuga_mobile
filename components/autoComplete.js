import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

export const AutoComplete = ({ data, onPress }) => {
  const renderItem = ({ item }) => {
    const style = getTagStyle(item.type);
    return (
      <Text style={{ ...styles.text, color: style.color }} category="c1" onPress={() => onPress(item.name)}>
        {item.name}
      </Text>
    );
  };
  const keyStractor = (item) => item.id.toString();
  return (
    <Layout style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={data}
        renderItem={renderItem}
        keyExtractor={keyStractor}
        windowSize={6}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '25%',
  },
  text: { padding: 6 },
});
