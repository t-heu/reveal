import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const styles = StyleSheet.create({
  container: {
    //justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    width: '100%',
    //minHeight: 135,
    backgroundColor: colors.secondaryColor,
    marginBottom: 10,
    padding: 15,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
    marginBottom: 8,
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
    color: '#fff',
    fontFamily: 'SulSans-Regular',
  },
  like: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
