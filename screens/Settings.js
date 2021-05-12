import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  ListItem,
  Button,
  Radio,
  Toggle,
} from '@ui-kitten/components';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const LayoutIcon = (props) => <Icon {...props} name="layout-outline" />;
const PlayIcon = (props) => <Icon {...props} name="play-circle-outline" />;
const LogOutIcon = (props) => <Icon {...props} name="log-out-outline" />;

export const SettingScreen = ({ navigation }) => {
  const [sizeForNew, setSizeForNew] = React.useState('large');
  const [sizeForSearch, setSizeForSearch] = React.useState('large');
  const [autoplay, setAutoplay] = React.useState(true);
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const radioLarge = () => <Radio checked={sizeForNew == 'large'} onChange={() => setSizeForNew('large')} />;
  const radioSmall = () => <Radio checked={sizeForNew == 'small'} onChange={() => setSizeForNew('small')} />;
  const radioLarge2 = () => <Radio checked={sizeForSearch == 'large'} onChange={() => setSizeForSearch('large')} />;
  const radioSmall2 = () => <Radio checked={sizeForSearch == 'small'} onChange={() => setSizeForSearch('small')} />;
  const toggleAutoplay = () => <Toggle size="small" checked={autoplay} onChange={(checked) => setAutoplay(checked)} />;

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Settings" alignment="center" accessoryLeft={BackAction} />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={LayoutIcon} style={{ paddingLeft: 0, width: 220 }}>
              <Text category="h6">Layout for "New"</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem title="Large list" accessoryRight={radioLarge} onPress={() => setSizeForNew('large')} />
            <Divider />
            <ListItem title="Small list" accessoryRight={radioSmall} onPress={() => setSizeForNew('small')} />
          </Layout>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={LayoutIcon} style={{ paddingLeft: 0, width: 240 }}>
              <Text category="h6">Layout for "Search"</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem title="Large list" accessoryRight={radioLarge2} onPress={() => setSizeForSearch('large')} />
            <Divider />
            <ListItem title="Small list" accessoryRight={radioSmall2} onPress={() => setSizeForSearch('small')} />
          </Layout>
          <Layout level="2">
            <Button appearance="ghost" accessoryRight={PlayIcon} style={{ paddingLeft: 0, width: 143 }}>
              <Text category="h6">Previews</Text>
            </Button>
          </Layout>
          <Layout>
            <ListItem
              title="Autoplay"
              description="Only applies to a large list layout"
              accessoryRight={toggleAutoplay}
              onPress={() => setAutoplay(!autoplay)}
            />
            <Divider />
          </Layout>
          <Layout
            level="2"
            style={{
              paddingHorizontal: 6,
              marginTop: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text status="info" category="s1">
              Log out
            </Text>
            <Button status="info" appearance="ghost" accessoryRight={LogOutIcon} />
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
