import './index.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MonopolyBankingPage, RootPage, TimerPage } from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
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
