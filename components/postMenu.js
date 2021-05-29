import React from 'react';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { storeData, getData } from '../util/storage';

const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const TrashIcon = (props) => <Icon {...props} name="trash-outline" fill="#E3170A" />;

export const PostMenu = ({
  item,
  deleteAlert,
  level = '1',
  sizeStar = 'small',
  sizeMore = 'small',
  menuStyle,
  menuStyle2,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuVisible2, setMenuVisible2] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const toggleMenu2 = () => {
    setMenuVisible2(!menuVisible2);
  };
  const menuAnchor = () => (
    <Button
      size={sizeStar}
      style={menuStyle ? menuStyle : { paddingHorizontal: 0 }}
      appearance="ghost"
      accessoryLeft={StarIcon}
      onPress={toggleMenu}>
      <Text status="primary" category="c1">
        {item.score}
      </Text>
    </Button>
  );
  const menuAnchor2 = () => (
    <Button
      size={sizeMore}
      style={menuStyle2 ? menuStyle2 : { paddingHorizontal: 0 }}
      status="basic"
      appearance="ghost"
      accessoryRight={MoreIcon}
      onPress={toggleMenu2}
    />
  );

  return (
    <Layout level={level} style={{ flexDirection: 'row' }}>
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
        {deleteAlert && (
          <MenuItem
            key="8"
            accessoryLeft={TrashIcon}
            title={
              <Text status="primary" category="c1">
                Remove
              </Text>
            }
            onPress={() => deleteAlert(item)}
          />
        )}
      </OverflowMenu>
    </Layout>
  );
};
