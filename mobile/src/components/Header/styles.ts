import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dotNotification: {
    position: 'absolute',
    top: 4,
    right: 0,
    zIndex: 10,
  },
  count_notification: {
    minWidth: 20,
    height: 20,
    paddingLeft: 2,
    paddingRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 2,
    lineHeight: 19,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    borderColor: colors.backgroundColor,
    backgroundColor: colors.colorBackCountNotification,
  },
  subHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    borderRadius: 100,
    height: 30,
    width: 30,
    marginLeft: 8,
  },
  backIcon: {
    padding: 8,
    borderRadius: 100,
    width: 45,
  },
});

export {styles, colors};
