import React, {useState, useCallback} from 'react';
import {TouchableOpacity, FlatList, View, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {ToastErrors} from '../../utils/tryToasts';
import {colors, stylesContainerPosts} from '../../styles';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Post from '../../components/Post';
import {styles} from './styles';

interface ISearch {
  search: string;
  shouldRefresh?: boolean;
  pageNumber?: number;
}

export default function Search() {
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchSave, setSearchSave] = useState('');

  const handleSubmitSearch = useCallback(
    async ({search, shouldRefresh = false, pageNumber = page}: ISearch) => {
      try {
        const schema = Yup.object().shape({
          search: Yup.string().required('Search required').min(3).max(50),
        });

        await schema.validate({search}, {abortEarly: false});

        if (total && pageNumber > Number(total)) {
          return;
        }

        setLoading(true);
        setSearchSave(search);

        const response = await api.get('/feed/post/search', {
          params: {
            page: pageNumber,
            q: search,
          },
        });

        setData(shouldRefresh ? response.data : [...data, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 10);
        setLoading(false);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          ToastErrors(errors.search);
          return;
        }

        ToastErrors('Loading failed');
        return;
      }
    },
    [total, page, data],
  );

  return (
    <View style={stylesContainerPosts.container}>
      <Formik
        initialValues={{search: ''}}
        onSubmit={(values) =>
          handleSubmitSearch({
            search: values.search,
            shouldRefresh: true,
            pageNumber: 0,
          })
        }>
        {({handleChange, handleSubmit, values}) => (
          <View style={{padding: 12, width: '100%'}}>
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
        onEndReached={() => handleSubmitSearch({search: searchSave})}
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
