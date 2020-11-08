import React from 'react';

import AppRoutes from './app.routes';
import AuhRoutes from './auth.routes';

import {useAuth} from '../hooks/auth';
import Loading from '../components/Loading';

export default function Route() {
  const {user, loading} = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? <AppRoutes /> : <AuhRoutes />;
}
