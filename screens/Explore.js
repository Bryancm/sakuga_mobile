import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
} from '@ui-kitten/components';
import data from '../test-data.json';
import {Card} from '../components/exploreCard';
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

export const ExploreScreen = () => {
  const renderPersonAction = () => <TopNavigationAction icon={PersonIcon} />;

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="Explore"
          alignment="center"
          accessoryRight={renderPersonAction}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              category="h1"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Trending
            </Text>
            <ScrollView horizontal>
              {data.map((item, i) => (
                <Card key={i} item={item} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              New Artist
            </Text>
            <ScrollView horizontal>
              {data.map((item, i) => (
                <Card key={i} item={item} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Week's popular
            </Text>
            <ScrollView horizontal>
              {data.map((item, i) => (
                <Card key={i} item={item} />
              ))}
            </ScrollView>
          </ScrollView>
        </Layout>
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
