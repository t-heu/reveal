import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    paddingLeft: 0,
    width: '100%',
  },
  title: {
    fontFamily: 'SulSans-Light',
    fontSize: 15,
    lineHeight: 20,
    width: 300,
    color: '#eee',
    marginBottom: 8,
  },
  input: {
    padding: 10,
    color: '#eee',
    borderWidth: 2,
    backgroundColor: '#333',
    borderColor: '#121212',
    fontFamily: 'SulSans-Regular',
    fontSize: 18,
    borderRadius: 4,
    width: 320,
    height: 50,
    marginTop: 10,
    paddingLeft: 14,
  },
});

export {styles, colors};
