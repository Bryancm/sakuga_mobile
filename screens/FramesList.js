import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Icon, Text } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const CheckmarkIcon = (props) => <Icon {...props} name="checkmark-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const formatSeconds = (seconds) => {
  return new Date(seconds ? seconds * 1000 : 0).toISOString().substr(14, 5);
};

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

export const FramesListScreen = ({ navigation, route }) => {
  const startTime = route.params.startTime;
  const endTime = route.params.endTime;
  const [selectView, setSelectView] = React.useState(false);

  const toggleSelectView = () => {
    setSelectView(!selectView);
  };

  const navigateBack = () => {
    navigation.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={selectView ? CloseIcon : CheckmarkIcon} onPress={toggleSelectView} />
      {selectView && <TopNavigationAction icon={DownloadIcon} onPress={toggleSelectView} />}
    </React.Fragment>
  );
  const renderItem = ({ item }) => (
    <FastImage style={{ width: '33%', height: 100, marginRight: 2, marginBottom: 2 }} key={item.id} source={item} />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Frames"
          subtitle={`${formatSeconds(startTime)} ~ ${formatSeconds(endTime)}`}
          alignment="center"
          accessoryLeft={renderBackAction}
          accessoryRight={renderRightActions}
        />
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
