import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import { PostMenu } from './postMenu';

export const DetailFooter = ({ style, item }) => {
  return (
    <Layout
      level="2"
      style={{
        ...style,
        marginBottom: 12,
      }}>
      <Text appearance="hint" category="c1" style={{ lineHeight: 16 }}>
        {`${getRelativeTime(item.created_at * 1000)}\nPosted by ${item.author}`}
      </Text>
      <PostMenu item={item} sizeStar="medium" level="2" />
    </Layout>
  );
};
