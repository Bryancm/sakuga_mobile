import React, {useState, useCallback} from 'react';
import {SafeAreaView, FlatList, StyleSheet, ScrollView} from 'react-native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
} from '@ui-kitten/components';
import {Tag} from '../components/tagItem';
import data from '../tag_data.json';
import {tagStyles} from '../styles';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

export const TagScreen = ({navigation}) => {
  const [type, setType] = useState('any');
  const renderPersonAction = () => <TopNavigationAction icon={PersonIcon} />;
  const renderSearchAction = () => <TopNavigationAction icon={SearchIcon} />;
  const renderItem = (info) => <Tag tag={info.item} />;
  const keyExtractor = (item) => item.id.toString();

  const buttonStyle = useCallback(
    (tagType) => {
      var color = '';
      switch (tagType) {
        case '0':
          color = tagStyles.general_outline.borderColor;
          break;
        case '1':
          color = tagStyles.artist_outline.borderColor;
          break;
        case '3':
          color = tagStyles.copyright_outline.borderColor;
          break;
        case '4':
          color = tagStyles.terminology_outline.borderColor;
          break;
        case '5':
          color = tagStyles.meta_outline.borderColor;
          break;
        case 'any':
          color = '#000';
          break;
        default:
          color = tagStyles.basic_outline.borderColor;
          break;
      }

      const style = {
        ...styles.button,
        backgroundColor:
          type === tagType ? tagStyles.basic_outline.borderColor : '#000',
        color: type === tagType ? color : tagStyles.basic_outline.borderColor,
        overflow: 'hidden',
      };

      return style;
    },
    [type],
  );

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="Tags"
          alignment="center"
          accessoryLeft={renderPersonAction}
          accessoryRight={renderSearchAction}
        />
        <Divider />
        <Layout style={styles.container}>
          <ScrollView
            horizontal
            style={{height: 100}}
            showsHorizontalScrollIndicator={false}>
            <Layout
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                onPress={() => setType('any')}
                style={buttonStyle('any')}
                category="s1">
                All
              </Text>
              <Text
                onPress={() => setType('0')}
                style={buttonStyle('0')}
                category="s1">
                General
              </Text>
              <Text
                onPress={() => setType('1')}
                style={buttonStyle('1')}
                category="s1">
                Artist
              </Text>
              <Text
                onPress={() => setType('3')}
                style={buttonStyle('3')}
                category="s1">
                Copyright
              </Text>
              <Text
                onPress={() => setType('4')}
                style={buttonStyle('4')}
                category="s1">
                Terminology
              </Text>
              <Text
                onPress={() => setType('5')}
                style={buttonStyle('5')}
                category="s1">
                Meta
              </Text>
            </Layout>
          </ScrollView>

          <ScrollView
            horizontal
            style={{height: 100}}
            showsHorizontalScrollIndicator={false}>
            <Layout
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                onPress={() => setType('any')}
                style={buttonStyle('any')}
                category="s1">
                Date
              </Text>
              <Text
                onPress={() => setType('0')}
                style={buttonStyle('0')}
                category="s1">
                Count
              </Text>
              <Text
                onPress={() => setType('1')}
                style={buttonStyle('1')}
                category="s1">
                Name
              </Text>
            </Layout>
          </ScrollView>

          <FlatList
            key="tag-list"
            numColumns={2} // set number of columns
            columnWrapperStyle={styles.row}
            style={{width: '100%'}}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </Layout>
        <Divider />
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
