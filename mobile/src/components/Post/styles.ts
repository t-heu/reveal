import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    width: '100%',
    minHeight: 110,
    backgroundColor: colors.secondaryColor,
    marginBottom: 10,
    padding: 15,
  },
  container_profile: {
    alignItems: 'center',
    marginRight: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginBottom: 8,
  },
  container_box: {
    width: '80%',
  },
  headerPost: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#c2c2c2',
    fontSize: 13,
  },
  description: {
    fontSize: 14,
    flexWrap: 'wrap',
    lineHeight: 18,
    color: '#fff',
    fontFamily: 'SulSans-Light',
  },
  footer: {
    flexDirection: 'row',
  },
  textLiked: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'SulSans-Regular',
    marginTop: 5,
  },
  textComment: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'SulSans-Regular',
    marginTop: 5,
    marginLeft: 12,
  },
});
