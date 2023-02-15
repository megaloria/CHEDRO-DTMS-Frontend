import React from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from 'react-router-dom';
import axios from 'axios';
import apiClient from './helpers/apiClient';

import Login from './components/views/Login/Login';
import Home from './components/views/Home/Home';

async function getCurrentUser() {
  return axios.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  }).then(() => {
    return apiClient.get('').then(response => {
      return response.data.data;
    }).catch(() => {
      return redirect('/login');
    });
  }).catch(() => {
    return redirect('/login');
  });
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    id: 'user',
    // errorElement: <div>Error!</div>,
    loader: getCurrentUser
  },
  {
    path: '/login',
    element: <Login />
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
