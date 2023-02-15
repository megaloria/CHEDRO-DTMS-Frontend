import React from 'react';
// import {
//   createBrowserRouter,
//   // redirect,
//   RouterProvider
// } from 'react-router-dom';
// import axios from 'axios';

// import Login from './views/Login/Login';
// import Home from './views/Home/Home';
import Header from './units/Header/Header';

// function getCurrentUser() {
//   return axios.get('/user').then(() => {
//     return null;
//   }).catch(() => {
//     return redirect('/login')
//   });
// }

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home />,
//     // errorElement: <div>Error!</div>,
//     // loader: getCurrentUser
//   },
//   {
//     path: '/login',
//     element: <Login />
//   },
// ]);

function App() {
  return (
    // <RouterProvider router={router} />
    <Header />
  );
}

export default App;
