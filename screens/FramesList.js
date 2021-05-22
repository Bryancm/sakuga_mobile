import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
const CloseIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

const data = [
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '1' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '2' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '3' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '4' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '5' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '6' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '7' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '8' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '9' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '11' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '22fd' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '22' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '12' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '32' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '34' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '243' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '121' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '2234' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '143' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '2423w' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '1523' },
  { uri: 'https://dlastframe.com/wp-content/uploads/sakuga-japan.jpg', id: '2423' },
];

export const FramesListScreen = ({ navigation }) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const renderSearchAction = () => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />;
  const renderItem = ({ item }) => (
    <FastImage style={{ width: '33%', height: 100, marginRight: 2, marginBottom: 2 }} key={item.id} source={item} />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Frames list" alignment="center" accessoryLeft={renderSearchAction} />
        <Divider />
        <Layout
          style={{
            flex: 1,
          }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          />
        </Layout>
        <Divider />
      </SafeAreaView>
    </Layout>
  );
};
