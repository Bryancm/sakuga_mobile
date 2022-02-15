import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import { Layout, Text, Icon, Button } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const TagIcon = (props) => <Icon {...props} name="pricetags-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const screenHeight = Dimensions.get('window').height;

export const AutoComplete = ({ data, onPress, deleteItemFromHistory, top, height, width, alignItems }) => {
  const renderItem = ({ item }) => {
    const tagStyle = getTagStyle(item.type);
    const style = tagStyle.color ? { ...styles.text, color: tagStyle.color } : styles.text;
    const onTagPress = () => onPress(item.name);
    const deleteHistoryAlert = () => {
      if (!deleteItemFromHistory) return;

      Alert.alert('Remove', `Do you want to remove ${item.name} from yout history ?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Confirm', onPress: () => deleteItemFromHistory(item.id), style: 'destructive' },
      ]);
    };

    return (
      <TouchableOpacity
        delayPressIn={0}
        delayPressOut={0}
        activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        onPress={onTagPress}>
        <Layout style={{ flexDirection: 'row' }}>
          <Button
            style={{ paddingHorizontal: 0 }}
            status="basic"
            size="small"
            appearance="ghost"
            accessoryLeft={item.isHistory ? ClockIcon : TagIcon}
          />

          <Text style={style} category="c1">
            {item.name}
          </Text>
        </Layout>
        {item.isHistory && (
          <Button
            style={{ paddingHorizontal: 0 }}
            status="basic"
            size="small"
            appearance="ghost"
            accessoryLeft={CloseIcon}
            onPress={deleteHistoryAlert}
          />
        )}
      </TouchableOpacity>
    );
  };

  const keyStractor = (item) => item.id.toString();

  let t = top ? top : screenHeight > 736 && !Platform.isPad ? 90 : 70;
  let h = height ? height : '58%';
  if (Platform.OS === 'android') {
    t = top ? top : 45;
    h = height ? height : '90%';
  }

  return (
    <Layout
      style={{
        ...styles.container,
        top: t,
        height: h,
      }}>
      <Layout
        style={{
          width: '100%',
          alignItems: alignItems ? alignItems : 'flex-start',
        }}>
        <FlatList
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ width: width ? width : '100%' }}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyStractor}
          windowSize={6}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
        />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '58%',
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  text: { paddingHorizontal: 8, paddingVertical: 6 },
});
