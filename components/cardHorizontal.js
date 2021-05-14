import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Layout, Text, Icon, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { tagStyles } from '../styles';
import { getRelativeTime } from '../util/date';
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const SmallCard = ({ item, tagsWithType }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuVisible2, setMenuVisible2] = React.useState(false);
  const [tags, setTags] = useState(item.tags.split(' ').map((tag) => ({ tag })));
  const [title, setTitle] = useState(capitalize(tags[2].tag).replaceAll('_', ' '));

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleMenu2 = () => {
    setMenuVisible2(!menuVisible2);
  };

  const renderMenuAction = () => (
    <Button
      status="basic"
      appearance="ghost"
      size="small"
      accessoryRight={MoreIcon}
      onPress={toggleMenu}
      style={{ paddingRight: 0, paddingVertical: 0, width: 20, paddingLeft: 24 }}
    />
  );

  const renderMenuAction2 = () => (
    <Button
      appearance="ghost"
      size="small"
      accessoryLeft={StarIcon}
      onPress={toggleMenu2}
      style={{ paddingHorizontal: 0, paddingVertical: 0, width: 20, marginRight: 3 }}>
      <Text status="primary" category="c1">
        {item.score}
      </Text>
    </Button>
  );

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
            if (type === 'artist') artist = artist + ' ' + capitalize(tag);
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
      const name = artist.trim() && artist.trim() !== 'Artist_unknown' ? artist.trim() : copyright.trim();
      const t = capitalize(name).replaceAll('_', ' ');
      setTitle(t);
      setTags(tags.sort((a, b) => a.type > b.type));
    };

    setPostDetails();
  }, []);

  return (
    <Layout style={styles.container}>
      <Image style={styles.image} source={{ uri: item.preview_url }} resizeMode="cover" />
      <Layout style={styles.tagContainer}>
        <Text category="c2" style={{ marginBottom: 6 }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ height: 70, lineHeight: 16 }} numberOfLines={4}>
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
            {getRelativeTime(item.created_at * 1000)}
          </Text>
          <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
            <OverflowMenu anchor={renderMenuAction2} visible={menuVisible2} onBackdropPress={toggleMenu2}>
              <MenuItem key="1" accessoryLeft={StarIconGood} title={<Text category="c1">Good</Text>} />
              <MenuItem key="2" accessoryLeft={StarIconGreat} title={<Text category="c1">Great</Text>} />
              <MenuItem key="3" accessoryLeft={StarIconFav} title={<Text category="c1">Favorite</Text>} />
              <MenuItem key="4" accessoryLeft={CloseIcon} title={<Text category="c1">Clear</Text>} />
            </OverflowMenu>
            <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
              <MenuItem key="5" accessoryLeft={LinkIcon} title={<Text category="c1">Share post</Text>} />
              <MenuItem key="6" accessoryLeft={DownloadIcon} title={<Text category="c1">Download</Text>} />
              <MenuItem key="7" accessoryLeft={ArchiveIcon} title={<Text category="c1">Add to watch list</Text>} />
            </OverflowMenu>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
