import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Welcome',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "I'm Chris Zombik, a writer of fantasy and non-fiction. My work explores the boundaries between the mundane and the magical, finding wonder in the everyday and truth in the fantastical.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Here you\'ll find my short stories, essays, and thoughts on the craft of writing.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [
      {
        link: {
          type: 'custom',
          label: 'Read My Stories',
          url: '/short-stories',
          appearance: 'default',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'About Me',
          url: '/about',
          appearance: 'outline',
        },
      },
    ],
  },
  meta: {
    description: 'Chris Zombik - Fantasy and non-fiction author. Explore short stories, essays, and more.',
    title: 'Chris Zombik | Author',
  },
  title: 'Home',
  layout: [
    {
      blockType: 'latestWorks',
      heading: 'Latest Stories',
      description: 'Recent short fiction from my collection.',
      count: 3,
    },
    {
      blockType: 'recentPosts',
      heading: 'Recent Thoughts',
      description: 'Essays, musings, and reflections on writing and life.',
      count: 3,
    },
  ],
}
