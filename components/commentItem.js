import React from 'react';
import { Divider, Icon, Layout, Text, Button, Input } from '@ui-kitten/components';

export const CommentItem = ({ item }) => {
  return (
    <Text category="c1" style={{ padding: 8 }}>
      {item.body}
    </Text>
  );
};
