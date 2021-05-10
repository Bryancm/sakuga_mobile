import React, {useState, useCallback} from 'react';
import {SafeAreaView, FlatList, StyleSheet, ScrollView} from 'react-native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Button,
  ListItem,
} from '@ui-kitten/components';
import {SmallCard} from '../components/uploadCard';
import {Tag} from '../components/tagItem';
import data from '../test-data-v2.json';
import {tagStyles} from '../styles';

const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;
const UploadIcon = (props) => <Icon {...props} name="cloud-upload-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const EyeIcon = (props) => <Icon {...props} name="eye-outline" />;
const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const ArrowIcon = (props) => (
  <Icon {...props} name="arrow-ios-forward-outline" />
);
const HeartIcon = (props) => <Icon {...props} name="heart-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const ProfileScreen = ({navigation}) => {
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} />;
  const renderFavIcon = () => (
    <Button appearance="ghost" accessoryLeft={HeartIcon} />
  );
  const renderClockIcon = () => (
    <Button appearance="ghost" accessoryLeft={ClockIcon} />
  );
  const renderSettingsAction = () => (
    <Button appearance="ghost" accessoryLeft={SettingsIcon} />
  );
  const renderEyeIcon = () => (
    <Button appearance="ghost" accessoryLeft={EyeIcon} />
  );
  const renderArchiveIcon = () => (
    <Button appearance="ghost" accessoryLeft={ArchiveIcon} />
  );
  const renderAddButton = () => (
    <Button
      size="tiny"
      appearance="outline"
      accessoryRight={PlusIcon}
      style={{borderRadius: 15, width: 20, height: 20}}>
      {/* <Text category="c1">Add</Text> */}
    </Button>
  );
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="Profile"
          alignment="center"
          accessoryRight={renderSearchAction}
        />
        <Divider />
        <ScrollView>
          <Layout style={{flexDirection: 'row'}}>
            <Button
              size="giant"
              appearance="ghost"
              accessoryRight={PersonIcon}
              style={{paddingLeft: 0}}>
              <Text category="h4">Welcome Bryan</Text>
            </Button>
          </Layout>
          <ListItem
            title="Favorites"
            description="Good, great and favorites sakugas"
            accessoryLeft={renderFavIcon}
            accessoryRight={ArrowIcon}
          />
          <ListItem
            title="History"
            description="Viewed sakugas"
            accessoryLeft={renderClockIcon}
            accessoryRight={ArrowIcon}
          />
          {/* <ListItem
            title="Following"
            description="Keep an eye on the comments"
            accessoryLeft={renderEyeIcon}
            accessoryRight={ArrowIcon}
          /> */}
          <ListItem
            title="Watch Later"
            description="Do not lose it"
            accessoryLeft={renderArchiveIcon}
            accessoryRight={ArrowIcon}
          />
          <ListItem
            title="Settings"
            description="Configure it to your taste"
            accessoryLeft={renderSettingsAction}
            accessoryRight={ArrowIcon}
          />
          <Layout
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Button
              style={{width: 155}}
              appearance="ghost"
              accessoryRight={renderAddButton}>
              <Text category="h4">Uploads</Text>
            </Button>
            <Button style={{width: 100, paddingRight: 0}} appearance="ghost">
              <Text category="p2">See more</Text>
            </Button>
          </Layout>
          <ScrollView horizontal>
            {data.posts.map((p) => (
              <SmallCard key={p.id} item={p} tagsWithType={data.tags} />
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 17,
  },
});
