import {StyleSheet} from 'react-native';
const basic = {
  borderWidth: 0.5,
  borderColor: '#F5F5F5',
  borderRadius: 13,
  paddingVertical: 5,
  paddingHorizontal: 8,
  maxWidth: 120,
};
export const tagStyles = StyleSheet.create({
  basic_outline: basic,
  artist_outline: {...basic, color: '#eebb4d', borderColor: '#eebb4d'},
  copyright_outline: {...basic, color: '#6f4a8e', borderColor: '#6f4a8e'},
  terminology_outline: {...basic, color: '#649d66', borderColor: '#649d66'},
  meta_outline: {...basic, color: '#E3170A', borderColor: '#E3170A'},
  general_outline: {...basic, color: '#D28E92', borderColor: '#D28E92'},
});
