// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App'
import Index from './pages/Index'             // ваша главная страница с кнопками
import HomePage from './components/HomePage' // только блок «Последние события»
import MapPage from './pages/MapPage'
import TrafficPage from './pages/TrafficPage'
import AutoServicesPage from './pages/AutoServicesPage'
import NotFound from './pages/NotFound'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,      // Здесь обёртка вашего приложения (Header, Toaster и т.д.)
    children: [
      // При заходе на "/" рендерим полностью оформленную страницу Index
      { index: true, element: <Index /> },

      // Отдельный роут для чистого списка событий (если нужно)
      { path: 'events', element: <HomePage /> },

      // Остальные разделы
      { path: 'map',      element: <MapPage /> },
      { path: 'traffic',  element: <TrafficPage /> },
      { path: 'services', element: <AutoServicesPage /> },

      // Любой другой путь → 404
      { path: '*', element: <NotFound /> },
    ],
  },
])

const container = document.getElementById('root')
if (!container) throw new Error('Root container not found')

createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
