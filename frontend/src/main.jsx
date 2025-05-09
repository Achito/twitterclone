import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize the tanstack query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid refecthing on window focus
      refetchOnWindowFocus: false,
    }
  }}
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
