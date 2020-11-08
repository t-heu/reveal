import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import {useShareStateComponent} from '../../hooks/shareStateComponent';
import {ToastErrors, ToastSuccess} from '../../utils/tryToasts';
import api from '../../services/api';

export default function ModalBottomSheetPost() {
  const {refRBSheet, modalPostData} = useShareStateComponent();

  async function handleSubmitDelete(id: string) {
    try {
      await api.post(`/feed/post/${id}`);
      ToastSuccess('post deleted successfully');
      refRBSheet.current.close();
    } catch (err) {
      ToastErrors('Something went wrong');
    }
  }

  async function handleSubmitHide(id: string) {
    try {
      await api.post(`/feed/post/hide/${id}`);
      ToastSuccess('muted post');
      refRBSheet.current.close();
    } catch (err) {
      ToastErrors('Something went wrong');
    }
  }

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0, 0.6)',
        },
        draggableIcon: {
          backgroundColor: '#777',
        },
        container: {
          backgroundColor: '#282828',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: 150,
        },
      }}>
      <View style={styles.container}>
        {!modalPostData.viewer_has_hidePost ? (
          <>
            <Text style={{fontSize: 12, color: '#888'}}>
              think carefully if you want to delete this post, there is no way
              to undo this action after.
            </Text>
            <TouchableOpacity
              onPress={() => handleSubmitDelete(modalPostData.id)}
              style={{
                marginBottom: 15,
                width: '100%',
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <Text style={styles.textModal}>Delete post</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={{fontSize: 12, color: '#888'}}>
              think carefully if you want to hide this post
            </Text>
            <TouchableOpacity
              onPress={() => handleSubmitHide(modalPostData.id)}
              style={{
                marginBottom: 15,
                width: '100%',
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <Text style={styles.textModal}>Hide post</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </RBSheet>
  );
}

export const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textModal: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SulSans-Regular',
  },
});
