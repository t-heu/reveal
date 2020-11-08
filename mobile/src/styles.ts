import {StyleSheet} from 'react-native';

export const colors = {
  primaryColor: '#27ae60',
  backgroundColor: '#121212',
  secondaryColor: '#282828',
  textColor: '#fff',
  colorBackCountNotification: '#ff0000',
};

export const stylesContainerPosts = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
  },
  posts: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
  },
});
