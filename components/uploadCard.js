import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Divider, Layout, Text, Icon, Button } from '@ui-kitten/components';
import { tagStyles } from '../styles';

const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;

export const SmallCard = ({ item, tagsWithType }) => {
  const capitalize = (s) => {
    return s && s[0].toUpperCase() + s.slice(1);
  };
  const [tags, setTags] = useState(item.tags.split(' ').map((tag) => ({ tag })));
  const [title, setTitle] = useState(capitalize(tags[2].tag).replace('_', ' '));
  const more_tags = tags.length - 6;

  useEffect(() => {
    const setPostDetails = () => {
      var artist = '';
      var copyright = '';
      var tags = [];
      for (const tag in tagsWithType) {
        if (Object.hasOwnProperty.call(tagsWithType, tag)) {
          const type = tagsWithType[tag];
          if (item.tags.includes(tag)) {
            var style = tagStyles.artist_outline;
            if (type === 'artist') artist = artist + tag + ' ';
            if (type === 'copyright') {
              style = tagStyles.copyright_outline;
              copyright = tag;
            }
            if (type === 'terminology') style = tagStyles.terminology_outline;
            if (type === 'meta') style = tagStyles.meta_outline;
            if (type === 'general') style = tagStyles.general_outline;
            tags.push({ type, tag, style });
          }
        }
      }
      const t = artist ? artist : copyright;
      setTitle(t.trim() === 'artist_unknown' ? copyright : t);
      setTags(tags.sort((a, b) => a.type > b.type));
    };

    setPostDetails();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date * 1000);
    let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da}-${mo}-${ye}`;
  };

  return (
    <Layout style={styles.container}>
      <Image style={styles.image} source={{ uri: item.preview_url }} resizeMode="cover" />
      <Layout style={styles.tagContainer}>
        {/* <Text category="s1" style={{marginBottom: 6}} numberOfLines={1}>
          {title}
        </Text> */}
        <Text style={{ height: 70 }} numberOfLines={4}>
          {tags.length > 0 &&
            tags.map((t, i) =>
              t.style ? (
                <Text key={i} category="c1" style={{ color: t.style.color }}>
                  {`${t.tag ? t.tag : t} `}
                </Text>
              ) : (
                <Text key={i} category="c1">
                  {`${t.tag ? t.tag : t} `}
                </Text>
              ),
            )}
        </Text>
        <Layout style={styles.buttonContainer}>
          <Text appearance="hint" category="c1">
            {formatDate(item.created_at)}
          </Text>
          <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              appearance="ghost"
              size="small"
              accessoryLeft={StarIcon}
              style={{ paddingHorizontal: 0, width: 20 }}>
              <Text status="primary" category="c1">
                {item.score}
              </Text>
            </Button>
            {/* <Button
              status="basic"
              appearance="ghost"
              size="small"
              accessoryLeft={MoreIcon}
              style={{ paddingHorizontal: 0, width: 5 }}
            /> */}
            <Icon name="more-vertical-outline" style={{ width: 15, height: 15 }} fill="#fff" />
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    paddingHorizontal: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  image: {
    height: 115,
    marginBottom: 5,
  },
  tagContainer: {},
  tagRow: {
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    // alignSelf: 'flex-end',
  },
  tagLimit: {
    maxWidth: 92,
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: 5,
    paddingLeft: 0,
  },
});
