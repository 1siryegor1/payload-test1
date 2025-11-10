'use server'

import { cookies } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const categories = formData.get('categories') as string

  if (!title || !slug) {
    return { success: false, error: 'Title and slug are required' }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return { success: false, error: 'You must be logged in to create a post' }
    }

    const payload = await getPayload({ config: configPromise })

    // Get current user with proper Headers object
    const headers = new Headers()
    headers.set('authorization', `JWT ${token}`)

    const { user } = await payload.auth({
      headers,
    })

    if (!user) {
      return { success: false, error: 'Authentication failed' }
    }

    // Parse categories - validate MongoDB ObjectID format
    const categoryIds = categories
      ? categories
          .split(',')
          .map((id) => id.trim())
          .filter((id) => /^[a-f\d]{24}$/i.test(id)) // Validate 24-char hex string
      : []

    // Create post with lexical content format
    const postData: any = {
      title,
      slug,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: content || '',
                  version: 1,
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      owner: user.id,
    }

    // Only add categories if there are valid ones
    if (categoryIds.length > 0) {
      postData.categories = categoryIds
    }

    const post = await payload.create({
      collection: 'posts',
      data: postData,
      user,
    })

    revalidatePath('/')

    return {
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    }
  } catch (error) {
    const err = error as Error
    console.error('Create post error:', err)
    return { success: false, error: err.message || 'Failed to create post' }
  }
}

