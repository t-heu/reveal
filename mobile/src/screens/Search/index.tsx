import React, {useState} from 'react';
import {TouchableOpacity, FlatList, View, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';

import {ToastErrors} from '../../utils/tryToasts';
import {colors, stylesContainerPosts} from '../../styles';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Post from '../../components/Post';
import {styles} from './styles';

interface ISearch {
  search: string;
}

export default function Search() {
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(false);

  async function handleSubmitSearch({search}: ISearch) {
    try {
      setLoading(true);

      const response = await api.get('/feed/post/search', {
        params: {
          description: search,
        },
      });

      setData(response.data);
      setLoading(false);
    } catch (error) {
      ToastErrors('Loading failed');
      return;
    }
  }

  return (
    <View style={stylesContainerPosts.container}>
      <Formik
        initialValues={{search: ''}}
        onSubmit={(values) => handleSubmitSearch(values)}>
        {({handleChange, handleSubmit, values}) => (
          <View style={{padding: 15, width: '100%'}}>
            <View style={styles.header}>
              <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => handleSubmit()}>
                <Feather name="search" size={24} color={colors.primaryColor} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Search"
                value={values.search}
                onChangeText={handleChange('search')}
                placeholderTextColor="#888"
                autoCorrect
                onSubmitEditing={() => handleSubmit()}
                returnKeyType="search"
              />
            </View>
          </View>
        )}
      </Formik>

      <FlatList
        style={stylesContainerPosts.posts}
        onEndReachedThreshold={0.3}
        keyExtractor={(item) => String(item.id)}
        data={data}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <Post data={item} />}
        ListFooterComponent={loading ? <Loading /> : null}
      />
    </View>
  );
}
