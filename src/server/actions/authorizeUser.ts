'use server'

import { cookies } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function authorizeUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      })

      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      }
    }

    return { success: false, error: 'Invalid credentials' }
  } catch (error: any) {
    console.error('Authorization error:', error)
    return { success: false, error: error.message || 'Authentication failed' }
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    const payload = await getPayload({ config: configPromise })

    // Create a proper Headers object for Payload
    const headers = new Headers()
    headers.set('authorization', `JWT ${token}`)

    const { user } = await payload.auth({
      headers,
    })

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  return { success: true }
}

