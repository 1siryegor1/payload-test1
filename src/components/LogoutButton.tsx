'use client'

import { logout } from '@/server/actions/authorizeUser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    await logout()
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="outline" size="sm">
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}

