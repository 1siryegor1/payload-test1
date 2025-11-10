import { getCurrentUser } from '@/server/actions/authorizeUser'
import LoginForm from '@/components/LoginForm'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'
import LogoutButton from '@/components/LogoutButton'

export default async function HomePage() {
  const user = await getCurrentUser()
  console.log('Current user:', user ? 'Logged in' : 'Not logged in')

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {!user ? (
          <LoginForm />
        ) : (
          <>
            <div className="p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Hello {user.name}!</h1>
                  <p className="text-gray-600">Welcome back to your blog.</p>
                </div>
                <LogoutButton />
              </div>
            </div>
            <PostForm />
            <PostList />
          </>
        )}
      </div>
    </div>
  )
}
