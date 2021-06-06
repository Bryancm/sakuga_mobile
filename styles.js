import { StyleSheet } from 'react-native';
const basic = {
  borderWidth: 0.9,
  borderColor: '#F5F5F5',
  borderRadius: 15,
  paddingVertical: 5,
  paddingHorizontal: 10,
};
export const tagStyles = StyleSheet.create({
  basic_outline: basic,
  artist_outline: { ...basic, color: '#eebb4d', borderColor: '#eebb4d' },
  copyright_outline: { ...basic, color: '#bc6ff1', borderColor: '#bc6ff1' },
  terminology_outline: { ...basic, color: '#649d66', borderColor: '#649d66' },
  meta_outline: { ...basic, color: '#E3170A', borderColor: '#E3170A' },
  general_outline: { ...basic, color: '#ee99a0', borderColor: '#ee99a0' },
});
