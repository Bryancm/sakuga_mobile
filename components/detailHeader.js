import React from 'react';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
import { useNavigation } from '@react-navigation/native';

export const DetailHeader = ({ title, style, url }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const navigation = useNavigation();

  const navigateGifEditor = () => {
    toggleMenu();
    navigation.navigate('GifEditor', { url });
  };

  const navigateFramesEditor = () => {
    toggleMenu();
    navigation.navigate('FramesEditor', { url });
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
      <Layout level="2" style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-start' }}>
        <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
          <MenuItem key="1" onPress={navigateFramesEditor} title={<Text category="c1">Frames</Text>} />
          <MenuItem key="2" onPress={navigateGifEditor} title={<Text category="c1">GIF</Text>} />
          <MenuItem key="3" title={<Text category="c1">Edit</Text>} />
        </OverflowMenu>
      </Layout>
    </Layout>
  );
};
