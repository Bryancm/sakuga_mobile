import React from 'react';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
const GridIcon = (props) => <Icon {...props} name="grid-outline" />;
const EditIcon = (props) => <Icon {...props} name="edit-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

export const DetailHeader = ({ title, style, url, setPaused, file_ext, id, isVideo, item }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const navigation = useNavigation();

  const navigateGifEditor = () => {
    setPaused(true);
    toggleMenu();
    navigation.navigate('GifEditor', { url, title, file_ext, id, item });
  };

  const navigateFramesEditor = () => {
    setPaused(true);
    toggleMenu();
    navigation.navigate('FramesEditor', { url, title, file_ext, id, item });
  };

  const menuAnchor = () => (
    <Button
      style={{ paddingHorizontal: 0, paddingTop: 16 }}
      status="basic"
      appearance="ghost"
      accessoryRight={OptionsIcon}
      onPress={toggleMenu}
    />
  );

  return (
    <Layout level="2" style={style}>
      <Text category="h6" style={{ lineHeight: 22, paddingVertical: 14, width: '90%' }}>
        {title}
      </Text>
      {isVideo && (
        <Layout level="2" style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-start' }}>
          <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
            <MenuItem
              key="1"
              onPress={navigateFramesEditor}
              title={<Text category="c1">Frames</Text>}
              accessoryLeft={GridIcon}
            />
            <MenuItem
              key="2"
              onPress={navigateGifEditor}
              title={<Text category="c1">GIF</Text>}
              accessoryLeft={ImageIcon}
            />
            {/* <MenuItem key="3" title={<Text category="c1">Edit</Text>} accessoryLeft={EditIcon} /> */}
          </OverflowMenu>
        </Layout>
      )}
    </Layout>
  );
};
