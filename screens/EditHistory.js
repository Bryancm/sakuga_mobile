import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Layout, Icon, TopNavigation, TopNavigationAction, Text, Button, Divider } from '@ui-kitten/components';
import { CreateAccountForm } from '../components/createAccountForm';
import { getData } from '../util/storage';
import { useNavigation } from '@react-navigation/native';
import { getTagStyle } from '../util/api';
// import cheerio from 'react-native-cheerio';
const cheerio = require('react-native-cheerio');

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const UserIcon = (props) => <Icon {...props} name="person-outline" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;

export const EditHistory = ({ route }) => {
  const { item } = route.params;
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const classToType = (spanClass) => {
    if (!spanClass) return -1;
    if (spanClass.includes('artist')) return 1;
    if (spanClass.includes('general')) return 2;
    if (spanClass.includes('copyright')) return 3;
    if (spanClass.includes('terminology')) return 4;
    if (spanClass.includes('meta')) return 5;
    return -1;
  };

  const getHistory = async () => {
    const res = await fetch('https://www.sakugabooru.com/history?show_all_tags=0&search=post%3A' + item.id);
    const htmlText = await res.text();
    const $ = cheerio.load(htmlText);
    var historyData = [];
    $('#history > tbody > tr ')
      .toArray()
      .map((tr) => {
        var item = {
          color: $(tr).find('td:nth-child(1)').attr('style'),
          date: $(tr).find('td:nth-child(2)').text(),
          author: $(tr).find('td.author').text(),
          tags: [],
        };
        var tags = [];

        $(tr)
          .find('td.change')
          .toArray()
          .map((span) => {
            const splittedTags = $(span).text().split(' ');
            for (const splittedTag of splittedTags) {
              const name = splittedTag.substring(1);
              const notParentesisName = name.replace('(', '').replace(')', '').replace(',', '');
              const spanClass = $(span).find(`span > span > span:contains("${notParentesisName}")`).attr('class');
              const type = classToType(spanClass);
              var obsolete = spanClass ? spanClass.includes('obsolete') : false;
              if (splittedTag[0] === '-') obsolete = true;
              tags.push({ name: splittedTag, spanClass, type, obsolete });
            }
          });
        item.tags = tags;
        historyData.push(item);
      });

    setData(historyData);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const navigateBack = () => {
    navigation.goBack();
  };

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.push('PostList', { from, isPosts, menuType, search, order, type });
  };

  const renderItem = ({ item }) => {
    return (
      <Layout style={{ paddingVertical: 8, justifyContent: 'center' }}>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Button
            style={{ paddingBottom: 0 }}
            size="small"
            appearance="ghost"
            accessoryLeft={UserIcon}
            onPress={() => navigatePostList(`user:${item.author}`, true, 'post', `user:${item.author}`)}>
            <Text category="c2">{item.author}</Text>
          </Button>
          <Button style={{ paddingBottom: 0 }} size="small" appearance="ghost" accessoryLeft={CalendarIcon}>
            <Text category="c2">{item.date}</Text>
          </Button>
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            paddingLeft: 32,
          }}>
          {item.tags.map((tag, index) => {
            const style = getTagStyle(tag.type);
            var name = tag.name.replace(',', '');
            if ((tag.name && tag.name[0] === '-') || (tag.name && tag.name[0] === '+')) {
              name = name.substring(1);
            }
            const hasComa = tag.name.includes(',');
            return (
              <Text
                category="s2"
                style={{ color: style.color, lineHeight: 18 }}
                key={`${tag.name}_${index}`}
                onPress={() => (tag.spanClass ? navigatePostList(name, true, 'post', name) : () => {})}>
                {tag.obsolete && tag.name && !tag.name.includes('+') && tag.spanClass && (
                  <Text category="s2" status="primary">
                    -
                  </Text>
                )}
                {!tag.obsolete && tag.name && tag.spanClass && (
                  <Text category="s2" status="success">
                    +
                  </Text>
                )}
                {tag.obsolete && tag.name && tag.name.includes('+') && tag.spanClass && (
                  <Text category="s2" style={{ color: '#477104' }}>
                    +
                  </Text>
                )}
                {`${name}${hasComa ? '' : ' '}`}
                {hasComa && <Text category="s2">,</Text>}
              </Text>
            );
          })}
        </Layout>
      </Layout>
    );
  };

  const keyExtractor = (item, index) => `${index}`;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Edit History" alignment="center" accessoryLeft={renderBackAction} />
        <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
      </SafeAreaView>
    </Layout>
  );
};
