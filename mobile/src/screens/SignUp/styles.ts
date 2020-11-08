import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    //justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    paddingLeft: 0,
    width: '100%',
  },
  title: {
    fontFamily: 'SulSans-Bold',
    fontSize: 25,
    color: '#eee',
    marginTop: 20,
    marginBottom: 5,
  },
  loginSocial: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
  },
  input: {
    padding: 10,
    color: '#eee',
    backgroundColor: '#333',
    borderColor: '#121212',
    fontFamily: 'SulSans-Regular',
    fontWeight: 'normal',
    fontSize: 18,
    width: 320,
    height: 50,
    paddingLeft: 14,
    borderRadius: 4,
  },
  inputEmail: {
    borderWidth: 2,
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputPassword: {
    backgroundColor: '#333',
    borderColor: '#121212',
    borderWidth: 2,
    borderTopWidth: 0,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width: 320,
  },
  inputName: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  fieldPassword: {
    width: '80%',
  },
});
