import React from 'react';
import { Linking } from 'react-native';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';
import ParsedText from 'react-native-parsed-text';
import Toast from 'react-native-simple-toast';

const DeleteIcon = (props) => <Icon {...props} name="trash-outline" fill="#E3170A" />;
const EditIcon = (props) => <Icon {...props} name="edit-outline" />;
const QuoteIcon = (props) => <Icon {...props} name="message-square-outline" />;
const FlagIcon = (props) => <Icon {...props} name="alert-circle-outline" />;
const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;

export const CommentItem = ({ item, user, onEdit, onDelete, onFlagComment, seek }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onQuotePress = () => {
    toggleMenu();
    item.isQuote = true;
    onEdit(item);
  };

  const onEditPress = () => {
    toggleMenu();
    onEdit(item);
  };

  const onDeleteComment = () => {
    toggleMenu();
    onDelete(item.id);
  };

  const onFlag = () => {
    toggleMenu();
    onFlagComment(item.id);
  };

  const urlPress = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) return console.log("Don't know how to open URI: " + url);
      Linking.openURL(url);
    });
  };

  const timePress = (time) => {
    const split = time.split(':');
    const minutesSeconds = Number(split[0]) * 60;
    const secondsMillis = Number(split[1]);
    const newPosition = minutesSeconds + secondsMillis;
    seek(newPosition);
    Toast.showWithGravity(`Showing: ${time}`, Toast.SHORT, Toast.CENTER);
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

  const menuAnchor = () => (
    <Button
      status="basic"
      size="small"
      appearance="ghost"
      style={{ paddingVertical: 0, paddingHorizontal: 0 }}
      accessoryRight={MoreIcon}
      onPress={toggleMenu}
    />
  );

  return (
    <Layout level="2" style={{ paddingLeft: 8, paddingTop: 0, marginBottom: 22 }}>
      <Layout level="2" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text category="s2">
          {`${item.creator} `}
          <Text appearance="hint" category="c1">
            {getRelativeTime(date)}
          </Text>
        </Text>
        {isUser ? (
          <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
            <MenuItem
              key="1"
              accessoryLeft={QuoteIcon}
              onPress={onQuotePress}
              title={<Text category="c1">Quote</Text>}
            />
            <MenuItem key="2" accessoryLeft={EditIcon} onPress={onEditPress} title={<Text category="c1">Edit</Text>} />
            <MenuItem
              key="3"
              accessoryLeft={DeleteIcon}
              onPress={onDeleteComment}
              title={<Text category="c1">Delete</Text>}
            />
          </OverflowMenu>
        ) : (
          <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
            <MenuItem
              key="1"
              accessoryLeft={QuoteIcon}
              onPress={onQuotePress}
              title={<Text category="c1">Quote</Text>}
            />
            <MenuItem key="2" accessoryLeft={FlagIcon} onPress={onFlag} title={<Text category="c1">Flag</Text>} />
          </OverflowMenu>
        )}
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
