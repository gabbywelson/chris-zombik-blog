import type { Block } from 'payload'

export const RecentPosts: Block = {
  slug: 'recentPosts',
  interfaceName: 'RecentPostsBlock',
  labels: {
    singular: 'Recent Posts',
    plural: 'Recent Posts',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Recent Thoughts',
      label: 'Section Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Optional introductory text below the heading',
      },
    },
    {
      name: 'count',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      label: 'Number of Posts to Show',
    },
  ],
}

