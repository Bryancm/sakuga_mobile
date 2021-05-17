import React from 'react';
import { Icon, Layout, Text, Button } from '@ui-kitten/components';
const OptionsIcon = (props) => <Icon {...props} name="options-2-outline" />;
import { useNavigation } from '@react-navigation/native';

export const DetailHeader = ({ title, style, url }) => {
  const navigation = useNavigation();
  const navigateGifEditor = () => {
    navigation.navigate('GifEditor', { url });
  };
  return (
    <Layout level="2" style={style}>
      <Text category="h6" style={{ lineHeight: 22, paddingVertical: 14, width: '90%' }}>
        {title}
      </Text>
      <Layout level="2" style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-start' }}>
        <Button
          style={{ paddingHorizontal: 0, paddingTop: 16 }}
          status="basic"
          appearance="ghost"
          accessoryRight={OptionsIcon}
          onPress={navigateGifEditor}
        />
      </Layout>
    </Layout>
  );
};
