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
import data from '../test-data-v2.json';
import tag_data from '../test-tag-data.json';
import tag_copy_data from '../test-tag-copy-data.json';
import {SmallCard as Card} from '../components/uploadCard';
import {Tag} from '../components/tag';

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ExploreScreen = () => {
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} />;
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="Explore"
          alignment="center"
          accessoryRight={renderSearchAction}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Trending
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 5}}>
              New Artist
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 5}}>
              <Layout style={{paddingVertical: 15}}>
                <Layout style={{flexDirection: 'row', marginBottom: 15}}>
                  {tag_data.map(
                    (tag, i) => i < 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
                <Layout style={{flexDirection: 'row'}}>
                  {tag_data.map(
                    (tag, i) => i >= 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
              </Layout>
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Week's Popular
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Character Acting
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 5}}>
              New Copyright
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 5}}>
              <Layout style={{paddingVertical: 15}}>
                <Layout style={{flexDirection: 'row', marginBottom: 15}}>
                  {tag_copy_data.map(
                    (tag, i) => i < 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
                <Layout style={{flexDirection: 'row'}}>
                  {tag_copy_data.map(
                    (tag, i) => i >= 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
              </Layout>
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Month's Popular
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Fighting
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 5}}>
              Popular Artist
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 5}}>
              <Layout style={{paddingVertical: 15}}>
                <Layout style={{flexDirection: 'row', marginBottom: 15}}>
                  {tag_data.map(
                    (tag, i) => i < 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
                <Layout style={{flexDirection: 'row'}}>
                  {tag_data.map(
                    (tag, i) => i >= 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
              </Layout>
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Liquid
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Explosions
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 5}}>
              Popular Copyright
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 5}}>
              <Layout style={{paddingVertical: 15}}>
                <Layout style={{flexDirection: 'row', marginBottom: 15}}>
                  {tag_copy_data.map(
                    (tag, i) => i < 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
                <Layout style={{flexDirection: 'row'}}>
                  {tag_copy_data.map(
                    (tag, i) => i >= 25 && <Tag key={i} tag={tag} />,
                  )}
                </Layout>
              </Layout>
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Hair
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Production Materials
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
              ))}
            </ScrollView>
            <Text
              category="h4"
              style={{paddingHorizontal: 5, paddingVertical: 15}}>
              Year's Popular
            </Text>
            <ScrollView horizontal>
              {data.posts.map((item, i) => (
                <Card key={i} item={item} tagsWithType={data.tags} />
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
