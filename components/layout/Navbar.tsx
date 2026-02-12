'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          🙏 Find My Pandit
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/services" className="hover:text-orange-200 transition">
            Services
          </Link>
          <Link href="/search" className="hover:text-orange-200 transition">
            Find Pandits
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:text-orange-200 transition">
                Dashboard
              </Link>
              <span className="text-orange-200 text-sm">
                Hi, {user.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hover:text-orange-200 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-orange-600 px-4 py-1.5 rounded font-medium hover:bg-orange-50 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}