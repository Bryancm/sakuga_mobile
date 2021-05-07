import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Divider, Layout, Text, Icon, Button} from '@ui-kitten/components';
import {tagStyles} from '../styles';

const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;

export const SmallCard = ({item, tagsWithType}) => {
  const capitalize = (s) => {
    return s && s[0].toUpperCase() + s.slice(1);
  };
  const [tags, setTags] = useState(item.tags.split(' ').map((tag) => ({tag})));
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
            tags.push({type, tag, style});
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
    let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    let mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    return `${da} / ${mo} / ${ye}`;
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.infoContainer}>
        <Image
          style={styles.image}
          source={{uri: item.preview_url}}
          resizeMode="cover"
        />
        <Layout style={styles.tagContainer}>
          <Text category="s1" style={{marginBottom: 6}} numberOfLines={1}>
            {title}
          </Text>
          <Layout style={{justifyContent: 'space-between', height: 90}}>
            <Layout>
              <Layout style={{...styles.tagRow}}>
                {tags.length > 0 &&
                  tags.map(
                    (t, i) =>
                      i <= 1 && (
                        <Text
                          key={i}
                          status="basic"
                          style={
                            t.style
                              ? {...t.style, ...styles.tagLimit}
                              : {
                                  ...tagStyles.basic_outline,
                                  ...styles.tagLimit,
                                }
                          }
                          category="c1"
                          numberOfLines={1}>
                          {t.tag ? t.tag : t}
                        </Text>
                      ),
                  )}
              </Layout>
              <Layout style={styles.tagRow}>
                {tags.length > 0 &&
                  tags.map(
                    (t, i) =>
                      i >= 2 &&
                      i <= 3 && (
                        <Text
                          key={i}
                          status="basic"
                          style={
                            t.style
                              ? {...t.style, ...styles.tagLimit}
                              : {...tagStyles.basic_outline, ...styles.tagLimit}
                          }
                          category="c1"
                          numberOfLines={1}>
                          {t.tag ? t.tag : t}
                        </Text>
                      ),
                  )}
              </Layout>
              <Layout style={styles.tagRow}>
                {tags.length > 0 &&
                  tags.map(
                    (t, i) =>
                      i >= 4 &&
                      i <= 5 && (
                        <Text
                          key={i}
                          status="basic"
                          style={
                            t.style
                              ? {...t.style, ...styles.tagLimit}
                              : {...tagStyles.basic_outline, ...styles.tagLimit}
                          }
                          category="c1"
                          numberOfLines={1}>
                          {t.tag ? t.tag : t}
                        </Text>
                      ),
                  )}
                {more_tags > 0 && (
                  <Text
                    key="0"
                    status="basic"
                    style={{...tagStyles.basic_outline, ...styles.tagLimit}}
                    category="c1"
                    numberOfLines={1}>
                    {`+ ${more_tags}`}
                  </Text>
                )}
              </Layout>
            </Layout>
            <Layout style={styles.buttonContainer}>
              <Text appearance="hint" category="c1">
                {formatDate(item.created_at)}
              </Text>
              <Layout style={{flexDirection: 'row'}}>
                <Button
                  status="info"
                  appearance="ghost"
                  size="small"
                  accessoryLeft={DownloadIcon}></Button>
                <Button
                  appearance="ghost"
                  size="small"
                  accessoryLeft={StarIcon}>
                  <Text status="primary" category="c1">
                    {item.score}
                  </Text>
                </Button>
              </Layout>
            </Layout>
          </Layout>
        </Layout>
      </Layout>

      <Divider />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  image: {
    width: '40%',
    height: 115,
    marginRight: 8,
  },
  tagContainer: {width: '60%'},
  tagRow: {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagLimit: {
    maxWidth: 120,
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: 5,
    paddingLeft: 0,
  },
});
