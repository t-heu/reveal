import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'SulSans-Bold',
    fontSize: 15,
  },
  buttonActive: {
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
  buttonInactive: {
    borderColor: '#333',
    backgroundColor: '#333',
  },
  textButtonActive: {
    color: '#fff',
  },
  textButtonInactive: {
    color: '#aeb2b3',
  },
});
