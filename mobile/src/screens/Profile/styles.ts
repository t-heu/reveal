import {StyleSheet} from 'react-native';
import {colors} from '../../styles';

export const styles = StyleSheet.create({
  upload: {
    width: 150,
    height: 150,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSendImage: {
    backgroundColor: colors.primaryColor,
    borderRadius: 100,
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    right: 0,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  progress: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
