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
import DocumentTypes from './components/views/DocumentTypes/DocumentTypes';
import HEIs from './components/views/HEIs/HEIs';
import Users from './components/views/Users/Users';
import Division from './components/views/Division/Division';


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
       {
        path: '/settings/DocumentTypes',
        element: <DocumentTypes />
      },
      {
        path: '/settings/HEIs',
        element: <HEIs />
      },
      {
        path: 'Users',
        element: <Users />
      },
      {
        path: 'Documents',
        element: <Documents />
      },
      {
        path: '/settings/divisions',
        element: <Division />
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

