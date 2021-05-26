import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Layout, Text, Icon, Button } from '@ui-kitten/components';
import { getTagStyle } from '../util/api';

const ClockIcon = (props) => <Icon {...props} name="clock-outline" />;
const TagIcon = (props) => <Icon {...props} name="pricetags-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;

export const AutoComplete = ({ data, onPress, deleteItemFromHistory }) => {
  const renderItem = ({ item }) => {
    const tagStyle = getTagStyle(item.type);
    const style = tagStyle.color ? { ...styles.text, color: tagStyle.color } : styles.text;
    const onTagPress = () => onPress(item.name);
    const deleteHistoryAlert = () =>
      Alert.alert('Remove', `Do you want to remove ${item.name} from yout history ?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Confirm', onPress: () => deleteItemFromHistory(item.id), style: 'destructive' },
      ]);

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

  return (
    <Layout style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={data}
        renderItem={renderItem}
        keyExtractor={keyStractor}
        windowSize={6}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '58%',
    position: 'absolute',
    top: 90,
    left: 0,
    zIndex: 10,
  },
  text: { paddingHorizontal: 8, paddingVertical: 6 },
});
