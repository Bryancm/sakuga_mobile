import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import { PostMenu } from './postMenu';
import { useNavigation } from '@react-navigation/native';

export const DetailFooter = ({ style, item }) => {
  const navigation = useNavigation();
  const navigatePostList = (from, isPosts, menuType, search, order, type) => {
    navigation.push('PostList', { from, isPosts, menuType, search, order, type });
  };
  return (
    <Layout
      level="2"
      style={{
        ...style,
        marginBottom: 12,
      }}>
      <Text appearance="hint" category="c1" style={{ lineHeight: 16 }}>
        {`${getRelativeTime(item.created_at * 1000)}\nPosted by `}
        <Text
          appearance="hint"
          category="c2"
          onPress={() => navigatePostList(`user:${item.author}`, true, 'post', `user:${item.author}`)}>
          {item.author}
        </Text>
      </Text>
      <PostMenu item={item} sizeStar="medium" level="2" />
    </Layout>
  );
};
