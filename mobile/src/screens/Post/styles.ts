import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    padding: 15,
    paddingTop: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'SulSans-SemiBold',
    color: '#fff',
  },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeText: {
    color: '#ccc',
    marginLeft: 6,
    marginBottom: 2,
    fontSize: 18,
  },
  inputCmt: {
    width: '100%',
    backgroundColor: colors.secondaryColor,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    fontSize: 16,
    color: '#fff',
    width: '75%',
    paddingLeft: 14,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    marginRight: 12,
    borderRadius: 100,
  },
  keyboardContainer: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
});

export {styles, colors};
