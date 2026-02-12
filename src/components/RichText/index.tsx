import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  BlockQuoteBlock as BlockQuoteBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BlockQuoteBlock } from '@/blocks/BlockQuote/Component'
import type { SerializedFootnoteNode } from '@/lexical/footnotes/FootnoteNode'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'
import { createFootnoteNumberMap, extractFootnotes } from '@/utilities/extractFootnotes'

type FootnoteInlineBlockFields = {
  blockName?: string
  blockType: 'footnoteReference'
  content: DefaultTypedEditorState
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      CTABlockProps | MediaBlockProps | BannerBlockProps | BlockQuoteBlockProps | CodeBlockProps
    >
  | SerializedInlineBlockNode<FootnoteInlineBlockFields>
  | SerializedFootnoteNode

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const INDENT_SIZE_REM = 2.5

const getIndentStyle = (indent?: number): React.CSSProperties | undefined => {
  if (!indent || indent <= 0) {
    return undefined
  }

  return {
    marginInlineStart: `${indent * INDENT_SIZE_REM}rem`,
  }
}

function createJsxConverters(
  footnoteNumberMap: Map<string, number>,
): JSXConvertersFunction<NodeTypes> {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    paragraph: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })

      if (!children?.length) {
        return (
          <p style={getIndentStyle(node.indent)}>
            <br />
          </p>
        )
      }

      return <p style={getIndentStyle(node.indent)}>{children}</p>
    },
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const NodeTag = node.tag

      return <NodeTag style={getIndentStyle(node.indent)}>{children}</NodeTag>
    },
    quote: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })

      return <blockquote style={getIndentStyle(node.indent)}>{children}</blockquote>
    },
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const NodeTag = node.tag

      return (
        <NodeTag className={`list-${node?.listType}`} style={getIndentStyle(node.indent)}>
          {children}
        </NodeTag>
      )
    },
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      blockQuote: ({ node }) => <BlockQuoteBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
    inlineBlocks: {
      footnoteReference: ({ node }) => {
        const number = footnoteNumberMap.get(node.fields.id) ?? 0
        return (
          <sup className="footnote-ref">
            <a
              href={`#footnote-${node.fields.id}`}
              id={`footnote-ref-${node.fields.id}`}
              className="text-primary hover:text-primary/80 no-underline"
              aria-label={`Footnote ${number}`}
            >
              [{number}]
            </a>
          </sup>
        )
      },
    },
    footnote: ({ node }) => {
      const footnoteNode = node as SerializedFootnoteNode
      const number = footnoteNumberMap.get(footnoteNode.id) ?? 0
      return (
        <sup className="footnote-ref">
          <a
            href={`#footnote-${footnoteNode.id}`}
            id={`footnote-ref-${footnoteNode.id}`}
            className="text-primary hover:text-primary/80 no-underline"
            title={footnoteNode.fields.content}
          >
            [{number}]
          </a>
        </sup>
      )
    },
  })
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props

  // Extract footnotes and create number map for this content
  const footnotes = extractFootnotes(data)
  const footnoteNumberMap = createFootnoteNumberMap(footnotes)
  const jsxConverters = createJsxConverters(footnoteNumberMap)

  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}

export { extractFootnotes } from '@/utilities/extractFootnotes'
export type { ExtractedFootnote } from '@/utilities/extractFootnotes'
