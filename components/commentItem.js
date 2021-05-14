import React from 'react';
import { Divider, Icon, Layout, Text, Button, Input } from '@ui-kitten/components';

export const CommentItem = ({ item }) => {
  return <Text>{item.body}</Text>;
};
