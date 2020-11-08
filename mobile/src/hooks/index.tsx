import React from 'react';

import {AuthProvider} from './auth';
import {ShareStateComponentProvider} from './shareStateComponent';

const AppProvider: React.FC = ({children}) => (
  <AuthProvider>
    <ShareStateComponentProvider>{children}</ShareStateComponentProvider>
  </AuthProvider>
);

export default AppProvider;
