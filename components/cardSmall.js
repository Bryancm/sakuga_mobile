import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Layout, Text, Icon, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import FastImage from 'react-native-fast-image';
import { PostMenu } from './postMenu';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const TrashIcon = (props) => <Icon {...props} name="trash-outline" fill="#E3170A" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;

export const CardSmall = ({ item, deleteAlert, navigateDetail }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisible2, setMenuVisible2] = useState(false);
  const tags = item.tags;
  const title = item.title;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleMenu2 = () => {
    setMenuVisible2(!menuVisible2);
  };

  const goToDetail = () => {
    navigateDetail(item, title, tags);
  };

  const renderMenuAction = () => (
    <Button
      style={{ paddingLeft: 0 }}
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

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={0.7}
      style={styles.container}
      onPress={goToDetail}>
      <Layout style={styles.infoContainer}>
        <FastImage style={styles.image} source={{ uri: item.preview_url }} resizeMode="cover" />
        <Layout style={styles.tagContainer}>
          <Text category="s1" style={{ marginBottom: 6 }} numberOfLines={1}>
            {title}
          </Text>
          <Layout style={{ justifyContent: 'space-between', height: 90 }}>
            <Text style={{ width: '95%' }} numberOfLines={5}>
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
              <PostMenu item={item} deleteAlert={deleteAlert} />
            </Layout>
          </Layout>
        </Layout>
      </Layout>

      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 132,
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
  tagContainer: { width: '60%' },
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
