import React from 'react';
import { Icon, Layout, Text, Button } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';

const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;

export const DetailFooter = ({ date, score, author, style }) => {
  return (
    <Layout
      level="2"
      style={{
        ...style,
        marginBottom: 12,
      }}>
      <Text appearance="hint" category="c1" style={{ lineHeight: 16 }}>
        {`${getRelativeTime(date * 1000)}\nPosted by ${author}`}
      </Text>
      <Layout level="2" style={{ flexDirection: 'row' }}>
        <Button style={{ paddingHorizontal: 0 }} appearance="ghost" accessoryLeft={StarIcon}>
          <Text status="primary" category="c1">
            {score}
          </Text>
        </Button>
        <Button style={{ paddingHorizontal: 0 }} status="basic" appearance="ghost" accessoryLeft={MoreIcon} />
      </Layout>
    </Layout>
  );
};
