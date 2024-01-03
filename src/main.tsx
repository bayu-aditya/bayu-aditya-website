import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MonopolyBankingPage, TimerPage } from './pages'
import Root from './routes/root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/timer',
    element: <TimerPage />,
  },
  {
    path: '/monopoly-banking',
    element: <MonopolyBankingPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
