import React from 'react';
import { SafeAreaView, Image, StyleSheet, ScrollView } from 'react-native';
import { Divider, Icon, Layout, Text, Button, Input } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import { tagStyles } from '../styles';
import { DetailHeader } from '../components/detailHeader';
import { TagList } from '../components/tagList';
import { DetailFooter } from '../components/detailFooter';
import { CommentList } from '../components/commentList';
import data from '../comment-data.json';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const EditIcon = (props) => <Icon {...props} name="edit-outline" />;
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;

export const DetailsScreen = ({ navigation, route }) => {
  const item = route.params.item;
  const title = route.params.title;
  const tags = route.params.tags;

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          source={{ uri: item.preview_url }}
          style={{ width: '100%', height: 210, marginBottom: 4, backgroundColor: '#000' }}
          resizeMode="contain"
        />
        <CommentList
          data={data}
          header={
            <Layout level="2">
              <DetailHeader title={title} style={styles.titleContainer} />
              <TagList tags={tags} style={styles.tagContainer} />
              <DetailFooter
                date={item.created_at}
                author={item.author}
                score={item.score}
                style={styles.titleContainer}
              />
              <Divider style={{ marginBottom: 12 }} />
              <Layout level="3" style={{ margin: 8, borderRadius: 2 }}>
                <Input style={{ backgroundColor: 'transparent', height: 40 }} placeholder="add a comment" />
              </Layout>
            </Layout>
          }
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    paddingLeft: 6,
    paddingTop: 0,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
