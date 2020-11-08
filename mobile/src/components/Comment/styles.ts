import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  commentContainer: {
    width: '100%',
    marginBottom: 130,
  },
  comments: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'column',
  },
  commentsImage: {
    borderRadius: 100,
    width: 35,
    height: 35,
    marginRight: 10,
  },
  text: {
    fontSize: 12,
    width: '80%',
    color: '#fff',
  },
  dateText: {
    color: '#777',
    fontSize: 12,
  },
  commentsProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
});
