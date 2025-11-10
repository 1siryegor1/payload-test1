import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
  ],
  access: {
    create: ({ req }) => !!req.user,
    read: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
}

