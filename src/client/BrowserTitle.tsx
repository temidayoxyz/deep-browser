/**
 * Chip title: globe before the hostname or the type label.
 */
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { GlobeGlyph } from './icons.tsx'
import css from './BrowserBody.module.css'

/**
 * The title as the chip and a floating panel's header show it.
 * @param props - the tab information hook.
 */
export function BrowserTitle({ useTabInfo }: PropsRuntime<'sidebar.right.pane.tab.title'>): ReactNode {
  const { tab } = useTabInfo()
  return (
    <>
      <GlobeGlyph size={14} className={css.titleIcon} />
      {tab.title}
    </>
  )
}
