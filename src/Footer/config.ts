import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Bluesky', value: 'bluesky' },
            { label: 'Threads', value: 'threads' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Goodreads', value: 'goodreads' },
            { label: 'Amazon Author', value: 'amazon' },
            { label: 'Website', value: 'website' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL including https://',
          },
        },
      ],
      maxRows: 10,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
