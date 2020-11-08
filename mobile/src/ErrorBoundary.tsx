import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from './styles';

type MyProps = {};

type MyState = {
  error: string | null;
  errorInfo: string | null;
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
  },
  text: {
    color: colors.primaryColor,
    textAlign: 'center',
    fontFamily: 'SulSans-SemiBold',
    fontSize: 20,
  },
});
