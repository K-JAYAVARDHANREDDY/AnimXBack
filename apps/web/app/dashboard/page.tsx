import { ClientDashboard } from '@/components/DashboardClient'

export const metadata = {
  title: 'Dashboard | AnimX',
  description: 'Browse, filter, and discover the best animations for your next project.',
}

export default function DashboardPage() {
  return (
    <ClientDashboard />
  )
}
