import React from 'react';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { getRelativeTime } from '../util/date';

const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;

export const DetailFooter = ({ date, score, author, style }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuVisible2, setMenuVisible2] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const toggleMenu2 = () => {
    setMenuVisible2(!menuVisible2);
  };
  const menuAnchor = () => (
    <Button style={{ paddingHorizontal: 0 }} appearance="ghost" accessoryLeft={StarIcon} onPress={toggleMenu}>
      <Text status="primary" category="c1">
        {score}
      </Text>
    </Button>
  );
  const menuAnchor2 = () => (
    <Button
      size="small"
      style={{ paddingHorizontal: 0 }}
      status="basic"
      appearance="ghost"
      accessoryRight={MoreIcon}
      onPress={toggleMenu2}
    />
  );
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
        <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
          <MenuItem key="1" accessoryLeft={StarIconGood} title={<Text category="c1">Good</Text>} />
          <MenuItem key="2" accessoryLeft={StarIconGreat} title={<Text category="c1">Great</Text>} />
          <MenuItem key="3" accessoryLeft={StarIconFav} title={<Text category="c1">Favorite</Text>} />
          <MenuItem key="4" accessoryLeft={CloseIcon} title={<Text category="c1">Clear</Text>} />
        </OverflowMenu>
        <OverflowMenu anchor={menuAnchor2} visible={menuVisible2} onBackdropPress={toggleMenu2}>
          <MenuItem key="5" accessoryLeft={LinkIcon} title={<Text category="c1">Copy link</Text>} />
          <MenuItem key="6" accessoryLeft={DownloadIcon} title={<Text category="c1">Download</Text>} />
          <MenuItem key="7" accessoryLeft={ArchiveIcon} title={<Text category="c1">Add to watch list</Text>} />
        </OverflowMenu>
      </Layout>
    </Layout>
  );
};
