'use client'

import { useState, useEffect } from 'react'
import { createPost } from '@/server/actions/createPost'
import { useRouter } from 'next/navigation'
import { CategorySelect } from './CategorySelect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Category = {
  id: string
  title: string
}

export default function PostForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch categories on component mount
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.docs) {
          setCategories(data.docs)
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err))
  }, [])

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Generate slug from title
    const title = formData.get('title') as string
    const slug = generateSlug(title)
    formData.set('slug', slug)

    // Add selected categories as comma-separated string
    if (selectedCategories.length > 0) {
      formData.set('categories', selectedCategories.join(','))
    }

    const result = await createPost(formData)

    setLoading(false)

    if (result.success) {
      setSuccess(`Post "${result.post?.title}" created successfully!`)
      e.currentTarget.reset()
      setSelectedCategories([])
      router.refresh()
    } else {
      setError(result.error || 'Failed to create post')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input type="text" id="title" name="title" required placeholder="My awesome post" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              rows={6}
              placeholder="Write your post content here..."
            />
          </div>
          <CategorySelect
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          {error && (
            <div className="p-3 bg-destructive/15 border border-destructive/50 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

