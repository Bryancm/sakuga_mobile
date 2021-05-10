import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  Button,
  Input,
} from '@ui-kitten/components';
import testData from '../test-tag-copy-data.json';
import {AutoComplete} from '../components/autoComplete';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const SearchScreen = ({navigation}) => {
  const [value, setValue] = React.useState(null);
  const [data, setData] = React.useState([]);
  const navigateBack = () => {
    navigation.goBack();
  };

  const onChangeText = (query) => {
    setValue(query);
    const splittedQuery = query.split(' ');
    const lastItem = splittedQuery[splittedQuery.length - 1];
    const d = testData.filter((t) =>
      t.name.toLowerCase().includes(lastItem.toLowerCase()),
    );
    setData(d);
  };

  const onAutoCompletePress = (item) => {
    const splittedValue = value.split(' ');
    const index = splittedValue.length - 1;
    splittedValue[index] = item + ' ';
    setValue(splittedValue.join(' '));
  };

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Input
          style={{padding: 8, width: '80%'}}
          size="small"
          status="basic"
          placeholder="Search"
          value={value}
          onChangeText={onChangeText}
        />
        <Button
          size="tiny"
          appearance="ghost"
          onPress={navigateBack}
          style={{
            width: 80,
            position: 'absolute',
            top: 50,
            right: 3,
            zIndex: 10,
          }}>
          <Text status="info">Cancel</Text>
        </Button>
        <Divider />
        <AutoComplete data={data} onPress={onAutoCompletePress} />

        <Layout
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category="h1">Search</Text>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
