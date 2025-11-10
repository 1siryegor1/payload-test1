import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Helper function to extract text from Lexical content
type LexicalNode = {
  type: string
  text?: string
  children?: LexicalNode[]
}

type LexicalContent = {
  root?: {
    children?: LexicalNode[]
  }
}

function extractTextFromLexical(content: LexicalContent): string {
  if (!content?.root?.children) return ''

  const extractFromNode = (node: LexicalNode): string => {
    if (node.type === 'text') return node.text || ''
    if (node.children) {
      return node.children.map((child) => extractFromNode(child)).join(' ')
    }
    return ''
  }

  return content.root.children
    .map((node) => extractFromNode(node))
    .join('\n')
    .trim()
}

export default async function PostList() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit: 10,
    sort: '-createdAt',
    depth: 2,
  })

  if (!posts.docs || posts.docs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No posts yet. Create your first post!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.docs.map((post) => {
            const owner = typeof post.owner === 'object' ? post.owner : null
            const categories = Array.isArray(post.categories)
              ? post.categories
                  .map((cat) => (typeof cat === 'object' ? cat.title : null))
                  .filter(Boolean)
              : []

            const contentText = post.content
              ? extractTextFromLexical(post.content as LexicalContent)
              : ''

            return (
              <div key={post.id} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  {categories.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {owner && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Author: {owner.name || owner.email}
                  </p>
                )}

                {post.createdAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                )}
                {contentText && (
                  <p className="text-sm mt-2 whitespace-pre-wrap line-clamp-3">{contentText}</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

