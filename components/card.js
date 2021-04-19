import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Divider, Layout, Text, Icon, Button} from '@ui-kitten/components';
import {tagStyles} from '../styles';

const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;

export const Card = ({item}) => {
  const tags = item.tags.split(' ');
  const more_tags = tags.length - 6;

  const formatDate = (date) => {
    const d = new Date(date * 1000);
    let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    let mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    return `${da} / ${mo} / ${ye}`;
  };

  const capitalize = (s) => {
    return s && s[0].toUpperCase() + s.slice(1);
  };

  const title = capitalize(tags[2]).replace('_', ' ');

  return (
    <Layout style={styles.container}>
      <Text style={{paddingHorizontal: 5, paddingVertical: 15}} category="h6">
        {title}
      </Text>
      <Image
        style={styles.image}
        source={{uri: item.preview_url}}
        resizeMode="stretch"
      />
      <Layout style={styles.tagContainer}>
        <Layout style={{...styles.tagRow, marginBottom: 15}}>
          {tags.length > 0 &&
            tags.map(
              (t, i) =>
                i < 3 && (
                  <Text
                    key={i}
                    status="basic"
                    style={t.style ? t.style : tagStyles.basic_outline}
                    category="c1"
                    numberOfLines={1}>
                    {t.name ? t.name : t}
                  </Text>
                ),
            )}
        </Layout>
        <Layout style={styles.tagRow}>
          {tags.length > 0 &&
            tags.map(
              (t, i) =>
                i >= 3 &&
                i < 6 && (
                  <Text
                    key={i}
                    status="basic"
                    style={t.style ? t.style : tagStyles.basic_outline}
                    category="c1"
                    numberOfLines={1}>
                    {t.name ? t.name : t}
                  </Text>
                ),
            )}
          {more_tags > 0 && (
            <Text
              key="0"
              status="basic"
              style={tagStyles.basic_outline}
              category="c1"
              numberOfLines={1}>
              {`+ ${more_tags}`}
            </Text>
          )}
        </Layout>
      </Layout>
      <Layout style={styles.buttonContainer}>
        <Button
          status="basic"
          size="small"
          appearance="ghost"
          accessoryLeft={CalendarIcon}>
          <Text category="c1">{formatDate(item.created_at)}</Text>
        </Button>
        <Layout style={{flexDirection: 'row'}}>
          <Button
            status="info"
            appearance="ghost"
            accessoryLeft={DownloadIcon}></Button>
          <Button appearance="ghost" accessoryLeft={StarIcon}>
            <Text status="primary" category="c1">
              {item.score}
            </Text>
          </Button>
        </Layout>
      </Layout>
      <Divider />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 220,
  },
  tagContainer: {paddingHorizontal: 5, paddingVertical: 15},
  tagRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
