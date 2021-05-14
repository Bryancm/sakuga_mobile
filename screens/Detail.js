import React from 'react';
import { SafeAreaView, Image, StyleSheet } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import { tagStyles } from '../styles';
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const PlayIcon = (props) => <Icon {...props} name="play-circle-outline" />;

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
        <Layout level="2" style={{ flex: 1 }}>
          <Image
            source={{ uri: item.preview_url }}
            style={{ width: '100%', height: 210, marginBottom: 4, backgroundColor: '#000' }}
            resizeMode="contain"
          />
          <Text category="h6" style={{ padding: 6, lineHeight: 20 }}>
            {title}
          </Text>
          <Layout level="2" style={styles.tagContainer}>
            {tags.length > 0 &&
              tags.map((t, i) =>
                t.style ? (
                  <Layout level="2" key={i} style={{ ...t.style, marginRight: 4, marginBottom: 8 }}>
                    <Text category="c1" style={{ color: t.style.color }} numberOfLines={1}>
                      {`${t.tag ? t.tag : t}  ${i}`}
                    </Text>
                  </Layout>
                ) : (
                  <Layout level="2" key={i} style={{ ...tagStyles.basic_outline, marginRight: 4, marginBottom: 8 }}>
                    <Text category="c1" numberOfLines={1}>
                      {t.tag ? t.tag : t}
                    </Text>
                  </Layout>
                ),
              )}
          </Layout>
          <Text appearance="hint" category="c1" style={{ marginLeft: 6, lineHeight: 16 }}>
            {`Posted by ${item.author} ${getRelativeTime(item.created_at * 1000)}`}
          </Text>
        </Layout>
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
});
