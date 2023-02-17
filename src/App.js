import React from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from 'react-router-dom';
import axios from 'axios';
import apiClient from './helpers/apiClient';

import ErrorPage from './components/views/ErrorPage/ErrorPage';
import Login from './components/views/Login/Login';
import Home from './components/views/Home/Home';
import Documents from './components/views/Documents/Documents';
import Roles from './components/views/Roles/Roles';

async function getCurrentUser (isHome = true) {
  return axios.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  }).then(() => {
    return apiClient.get('/user').then(response => {
      if (isHome) {
        return response.data.data;
      } else {
        return redirect('/');
      }
    }).catch(() => {
      if (isHome) {
        return redirect('/login');
      }
      return null;
      
    });
  }).catch(() => {
    if (isHome) {
      return redirect('/login');
    }
    return null;
  });
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    id: 'user',
    errorElement: <ErrorPage />,
    loader: () => getCurrentUser(),
    children: [
      {
        index: true,
        element: <Documents />
      },
      {
        path: '/settings/roles',
        element: <Roles />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />,
    loader: () => getCurrentUser(false)
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

