import React from 'react';
import { Linking } from 'react-native';
import { Divider, Icon, Layout, Text, Button, Input } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import ParsedText from 'react-native-parsed-text';

const QuoteIcon = (props) => <Icon {...props} name="message-square-outline" />;
const FlagIcon = (props) => <Icon {...props} name="flag-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;

export const CommentItem = ({ item, user }) => {
  const urlPress = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) return console.log("Don't know how to open URI: " + url);
      Linking.openURL(url);
    });
  };

  const timePress = (time) => {
    console.log(time);
  };

  const textParse = [
    {
      pattern: /[0-5]?\d:[0-5]\d\d*/,
      style: { color: '#2980b9', fontSize: 15, letterSpacing: 1.5 },
      onPress: timePress,
    },
    { type: 'url', style: { color: '#2980b9' }, onPress: urlPress },
  ];

  const isUser = user && user.toLowerCase() === item.creator.toLowerCase();
  const date = new Date(item.created_at);

  var quotes = item.body.match(/\[quote\](?:.|\n|\r)+?\[\/quote\][\n\r]*/gm);
  const body = item.body.split(/\[quote\](?:.|\n|\r)+?\[\/quote\][\n\r]*/gm).filter((b) => b);
  const hasQuotes = quotes && quotes.length > 0;

  if (hasQuotes) {
    quotes = quotes.map((q) => {
      return q
        .replace('[quote]', '')
        .replace('[/quote]', '')
        .replace(/(\n\s*?\n)\s*\n/, '');
    });
  }

  return (
    <Layout level="2" style={{ paddingHorizontal: 8, paddingTop: 0, marginBottom: 22 }}>
      <Layout level="2" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text category="s2">
          {`${item.creator} `}
          <Text appearance="hint" category="c1">
            {getRelativeTime(date)}
          </Text>
        </Text>
        <Button
          status="basic"
          size="small"
          appearance="ghost"
          style={{ paddingVertical: 0, paddingHorizontal: 0 }}
          accessoryRight={MoreIcon}
        />
      </Layout>

      {hasQuotes ? (
        quotes.map((q, i) => (
          <Layout level="2" key={i} style={{ paddingHorizontal: 8 }}>
            <Layout level="3" style={{ borderRadius: 2, marginLeft: 8 }}>
              <Text category="c1" style={{ lineHeight: 17, padding: 8 }}>
                <ParsedText parse={textParse} selectable={true}>
                  {q}
                </ParsedText>
              </Text>
            </Layout>
            <Text category="c1" style={{ lineHeight: 17, paddingTop: 8 }}>
              <ParsedText parse={textParse} selectable={true}>
                {body[i]}
              </ParsedText>
            </Text>
          </Layout>
        ))
      ) : (
        <Text category="c1" style={{ lineHeight: 17, paddingHorizontal: 8 }}>
          <ParsedText parse={textParse} selectable={true}>
            {body[0]}
          </ParsedText>
        </Text>
      )}
    </Layout>
  );
};
