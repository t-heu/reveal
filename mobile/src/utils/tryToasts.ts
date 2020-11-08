// import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * @paramers description, title
 */
export function ToastErrors(text: string, title = 'Error'): void {
  return Toast.show({
    type: 'error',
    position: 'top',
    text1: title,
    text2: text,
  });
}

/**
 *  description, title
 */
export function ToastSuccess(text: string, title = 'Success'): void {
  return Toast.show({
    type: 'success',
    position: 'top',
    text1: title,
    text2: text,
  });
}

/**
 *  description, title
 */
export function ToastInfo(text: string, title = 'Sorry'): void {
  return Toast.show({
    type: 'info',
    position: 'top',
    text1: title,
    text2: text,
  });
}
