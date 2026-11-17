import type { ReactNode } from 'react'

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="font-600 text-[#221A3A]">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={key} className="rounded-md bg-[#F3E9D2] px-1.5 py-0.5 font-mono text-[12px] text-[#8A6A22]">
          {part.slice(1, -1)}
        </code>
      )
    }

    return <span key={key}>{part}</span>
  })
}

function TextBlocks({ text }: { text: string }) {
  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let paragraph: string[] = []
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null
  let nodeIndex = 0

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const content = paragraph.join(' ')
    nodes.push(
      <p key={`p-${nodeIndex++}`} className="leading-relaxed">
        {renderInline(content, `p-${nodeIndex}`)}
      </p>,
    )
    paragraph = []
  }

  const flushList = () => {
    if (!list) return
    const Tag = list.type
    nodes.push(
      <Tag
        key={`list-${nodeIndex++}`}
        className={`space-y-1 pl-5 ${list.type === 'ul' ? 'list-disc' : 'list-decimal'}`}
      >
        {list.items.map((item, index) => (
          <li key={`item-${index}`}>{renderInline(item, `item-${nodeIndex}-${index}`)}</li>
        ))}
      </Tag>,
    )
    list = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      const className =
        level === 1
          ? 'text-base font-700 text-[#221A3A]'
          : level === 2
            ? 'text-sm font-700 text-[#221A3A]'
            : 'text-sm font-600 text-[#2B2140]'
      nodes.push(
        <p key={`h-${nodeIndex++}`} className={className}>
          {renderInline(heading[2], `h-${nodeIndex}`)}
        </p>,
      )
      continue
    }

    const bullet = line.match(/^[-*]\s+(.*)$/)
    if (bullet) {
      flushParagraph()
      if (!list || list.type !== 'ul') {
        flushList()
        list = { type: 'ul', items: [] }
      }
      list.items.push(bullet[1])
      continue
    }

    const numbered = line.match(/^\d+[.)]\s+(.*)$/)
    if (numbered) {
      flushParagraph()
      if (!list || list.type !== 'ol') {
        flushList()
        list = { type: 'ol', items: [] }
      }
      list.items.push(numbered[1])
      continue
    }

    if (list) flushList()
    paragraph.push(line.trim())
  }

  flushParagraph()
  flushList()

  return <>{nodes}</>
}

export default function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(```[\s\S]*?```)/g).filter(Boolean)

  return (
    <div className="space-y-2 break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).replace(/^[a-zA-Z0-9_-]*\n/, '')
          return (
            <pre
              key={`code-${index}`}
              className="overflow-x-auto rounded-xl bg-gray-900 p-3 text-[12px] leading-relaxed text-gray-100"
            >
              <code>{code.trim()}</code>
            </pre>
          )
        }

        return <TextBlocks key={`text-${index}`} text={part} />
      })}
    </div>
  )
}
