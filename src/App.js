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
import Users from './components/views/Users/Users';
import Roles from './components/views/Roles/Roles';
import HEIs from './components/views/HEIs/HEIs';
import DocumentTypes from './components/views/DocumentTypes/DocumentTypes';
import Divisions from './components/views/Divisions/Divisions';
import NGA from './components/views/NGA/NGA';
import CHED from './components/views/CHED/CHED';
import Category from './components/views/Category/Category';
import AdminDocReceive from './components/views/Documents/admin/DocumentReceive';
import AdminDocEdit from './components/views/Documents/admin/DocumentEdit';
import AdminDocView from './components/views/Documents/admin/DocumentView';

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
        path: '/settings/HEIs',
        element: <HEIs />
      },
      {
        path: '/settings/DocumentTypes',
        element: <DocumentTypes />
      },
      {
        path: '/settings/Divisions',
        element: <Divisions />
      },
      {
        path: '/settings/NGA',
        element: <NGA />
      },
      {
        path: '/settings/CHED',
        element: <CHED />
      },
      {
        path: '/settings/Category',
        element: <Category />
      },
      {
        path: '/Home/Documents',
        element: <Documents />
      },
      {
        path: '/Home/Users',
        element: <Users />
      },
      {
        path: '/Documents/Documents-Receive',
        element: <AdminDocReceive />
      },
      {
        path: '/Documents/Documents-Edit',
        element: <AdminDocEdit />
      },
      {
        path: '/Documents/Documents-View',
        element: <AdminDocView />
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

