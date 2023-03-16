import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
  useLocation
} from 'react-router-dom';
import axios from 'axios';
import Validator from 'validatorjs';
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
import ChangePass from './components/views/ChangePassword/ChangePassword';

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

//example for document views
async function getDocument ({ params }) {
  let validation = new Validator(params, {
    documentId: 'required|integer|min:1'
  });
  if (validation.fails()) {
    return redirect('../');
  }
  return apiClient.get(`/document/${params.documentId}`).then(response => {
    return response.data.data
  }).catch(error => {
    return redirect('../');
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
        element: <Navigate to='/documents' />
      },
      {
        path: '/documents',
        element: <div><Outlet /></div>,
        children: [
          {
            index: true,
            element: <Documents />,
          },
          {
            path: 'receive',
            element: <AdminDocReceive />
          },
          {
            path: 'edit/documentId',
            element: <AdminDocEdit />,
            loader: getDocument
          },
          {
            path: 'view/:documentId',
            element: <AdminDocView />,
            loader: getDocument
          },
        ]
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'change-password',
        element: <ChangePass />
      },
      {
        path: '/settings',
        element: <div><Outlet /></div>,
        children: [
          {
            path: 'roles',
            element: <Roles />,
          },
          {
            path: 'heis',
            element: <HEIs />
          },
          {
            path: 'document-types',
            element: <DocumentTypes />
          },
          {
            path: 'divisions',
            element: <Divisions />
          },
          {
            path: 'ngas',
            element: <NGA />
          },
          {
            path: 'ched-offices',
            element: <CHED />
          },
          {
            path: 'categories',
            element: <Category />
          },
        ]
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

