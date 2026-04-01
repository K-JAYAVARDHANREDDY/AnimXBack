'use client'

import dynamic from 'next/dynamic'
import DashboardLoading from '@/app/dashboard/loading'

// By wrapping the dashboard in a Client Component with ssr: false, 
// we bypass the heavy server-side compilation of Three.js and Framer Motion during local development.
export const ClientDashboard = dynamic(
  () => import('./AnimXDashBoard').then((mod) => mod.AnimXDashboard),
  { ssr: false, loading: () => <DashboardLoading /> }
)
