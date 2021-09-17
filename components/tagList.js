import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { tagStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import { findTag } from '../api/tag';

const ChevronDownIcon = (props) => (
  <Icon name="arrow-ios-downward-outline" style={{ width: 18, height: 18 }} fill="#808080" />
);
const ChevronUpIcon = (props) => (
  <Icon name="arrow-ios-upward-outline" style={{ width: 18, height: 18 }} fill="#808080" />
);

export const TagList = ({ tags, style, level = '2', loadCount = false, setPaused }) => {
  const isPad = Platform.isPad;
  const maxTags = isPad ? 10 : 5;
  const [more, setMore] = useState();
  const [allTags, setAllTags] = useState(tags);
  const [postTags, setTags] = useState(allTags.slice(0, maxTags));
  const navigation = useNavigation();

  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    if (setPaused) setPaused(true);
    navigation.push('PostList', { from, isPosts, menuType, search, order, type });
  };

  const getTagCount = async () => {
    try {
      var tagFetches = [];
      var newTags = [];
      for (const tag of tags) {
        tagFetches.push(findTag({ name: tag.tag }));
      }
      const responses = await Promise.all(tagFetches);

      for (let index = 0; index < responses.length; index++) {
        const response = responses[index];
        const responseTag = response.find((t) => t.name === tags[index].tag);
        const newTag = { ...tags[index], count: responseTag.count };
        newTags.push(newTag);
      }
      setAllTags(newTags);
      const t = more ? newTags : newTags.slice(0, maxTags);
      setTags(t);
    } catch (error) {
      console.log('GET_TAG_COUNT_ERROR: ', error);
    }
  };
  useEffect(() => {
    if (loadCount) getTagCount();
  }, []);
  const toggleMore = () => {
    if (more) setTags(allTags.slice(0, maxTags));
    if (!more) setTags(allTags);
    setMore(!more);
  };
  return (
    <Layout level={level} style={style}>
      <Layout level={level} style={style}>
        {postTags.length > 0 &&
          postTags.map((t, i) =>
            t.style ? (
              <TouchableOpacity
                key={i}
                delayPressIn={0}
                delayPressOut={0}
                activeOpacity={0.7}
                style={{ ...t.style, marginRight: 4, marginBottom: 8 }}
                onPress={() => navigatePostList(t.tag, true, 'post', t.tag)}>
                <Text category="c1" style={{ color: t.style.color }} numberOfLines={1}>
                  {`${t.tag ? t.tag : t}${t.count ? ' ' + t.count : ''}`}
                </Text>
              </TouchableOpacity>
            ) : (
              <Layout level={level} key={i} style={{ ...tagStyles.basic_outline, marginRight: 4, marginBottom: 8 }}>
                <Text category="c1" numberOfLines={1}>
                  {`${t.tag ? t.tag : t}${t.count ? ' ' + t.count : ''}`}
                </Text>
              </Layout>
            ),
          )}
        {tags.length > maxTags && (
          <Button
            size="small"
            status="basic"
            appearance="ghost"
            accessoryRight={more ? ChevronUpIcon : ChevronDownIcon}
            style={{ paddingHorizontal: 0, paddingVertical: 0 }}
            onPress={toggleMore}
          />
        )}
      </Layout>
    </Layout>
  );
};
