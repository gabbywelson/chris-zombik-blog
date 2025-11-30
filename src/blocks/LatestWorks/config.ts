import type { Block } from 'payload'

export const LatestWorks: Block = {
  slug: 'latestWorks',
  interfaceName: 'LatestWorksBlock',
  labels: {
    singular: 'Latest Works',
    plural: 'Latest Works',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Latest Works',
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
      label: 'Number of Stories to Show',
    },
  ],
}

