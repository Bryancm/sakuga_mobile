import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Layout, Text, Icon, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { tagStyles } from '../styles';

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

export const Card = ({ item, tagsWithType, navigateDetail }) => {
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
      style={{ paddingLeft: 0, paddingRight: 0 }}
      status="basic"
      appearance="ghost"
      size="small"
      accessoryLeft={MoreIcon}
      onPress={toggleMenu}
    />
  );

  const renderMenuAction2 = () => (
    <Button appearance="ghost" size="small" accessoryLeft={StarIcon} onPress={toggleMenu2}>
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

  const formatDate = (date) => {
    const d = new Date(date * 1000);
    let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da}-${mo}-${ye}`;
  };

  const goToDetail = () => {
    navigateDetail(item, title, tags);
  };

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={styles.container}
      onPress={goToDetail}>
      <Text style={{ paddingHorizontal: 5, paddingVertical: 15 }} category="h6" numberOfLines={1}>
        {title}
      </Text>
      <Image style={styles.image} source={{ uri: item.preview_url }} resizeMode="stretch" />
      <Layout style={styles.tagContainer}>
        {tags.length > 0 &&
          tags.map((t, i) =>
            t.style ? (
              <Layout key={i} style={{ ...t.style, marginRight: 4, marginBottom: 8 }}>
                <Text category="c1" style={{ color: t.style.color, maxWidth: 114 }} numberOfLines={1}>
                  {t.tag ? t.tag : t}
                </Text>
              </Layout>
            ) : (
              <Layout key={i} style={{ ...tagStyles.basic_outline, marginRight: 4, marginBottom: 8 }}>
                <Text category="c1" style={{ maxWidth: 108 }} numberOfLines={1}>
                  {t.tag ? t.tag : t}
                </Text>
              </Layout>
            ),
          )}
      </Layout>
      <Layout style={styles.buttonContainer}>
        <Text appearance="hint" category="c1" style={{ marginLeft: 6, lineHeight: 16 }}>
          {`${formatDate(item.created_at)}\nPosted by ${item.author}`}
        </Text>
        <Layout style={{ flexDirection: 'row' }}>
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
      <Divider />
    </TouchableOpacity>
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
  tagContainer: {
    paddingLeft: 4,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagLimit: {
    borderRadius: 13,
  },
});
