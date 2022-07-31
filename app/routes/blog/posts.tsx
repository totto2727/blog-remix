import type { CSSObject } from '@mantine/core'
import { AppShell, Aside, Footer, Navbar, ScrollArea } from '@mantine/core'
import { Outlet } from '@remix-run/react'
import { BlogHeader } from '~/features/blog/components/domain/BlogHeader'

const styles: Partial<Record<'body' | 'main' | 'root', CSSObject>> = {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
  },
  main: { width: '100%' },
}
export default function Posts() {
  return (
    <AppShell
      styles={styles}
      header={<BlogHeader />}
      // footer={<Footer height={"fit-content"}>footer</Footer>}
      // aside={<Aside>aside</Aside>}
      navbar={<Navbar>Navbar</Navbar>}
    >
      <ScrollArea type='always'>
        <Outlet />
      </ScrollArea>
    </AppShell>
  )
}
