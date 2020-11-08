import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  input: {
    padding: 10,
    color: '#fff',
    fontSize: 16,
    width: '100%',
    height: 500,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginTop: 10,
    paddingLeft: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
    color: '#333',
  },
  header: {
    padding: 20,
    backgroundColor: colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
