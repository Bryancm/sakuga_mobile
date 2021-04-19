import React from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import {Card} from '../components/card';
import data from '../test-data.json';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

export const NewScreen = () => {
  const renderPersonAction = () => <TopNavigationAction icon={PersonIcon} />;

  const renderItem = (info) => {
    return <Card item={info.item} />;
  };

  const keyExtractor = (item) => item.id.toString();

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="New"
          alignment="center"
          accessoryRight={renderPersonAction}
        />
        <Divider />
        <FlatList
          style={styles.container}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
