import {StyleSheet} from 'react-native';
import {colors} from '../../styles';

const stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    padding: 8,
  },
  header: {
    marginBottom: 25,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontFamily: 'SulSans-SemiBold',
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SulSans-Regular',
    color: '#fff',
  },
  field: {
    backgroundColor: colors.backgroundColor,
    padding: 11,
    height: 60,
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  textInfo: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SulSans-Light',
  },
});

const stylesEditsPages = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  header: {
    width: '100%',
    marginTop: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontFamily: 'SulSans-SemiBold',
    fontSize: 14,
  },
  div: {
    padding: 10,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
  },
  input: {
    color: '#eee',
    fontSize: 20,
    padding: 10,
    paddingBottom: 4,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#444',
    alignItems: 'flex-start',
    paddingLeft: 0,
    fontFamily: 'SulSans-Light',
  },
});

export {stylesSettings, stylesEditsPages, colors};
