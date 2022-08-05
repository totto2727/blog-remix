import type { CSSObject } from '@mantine/core'
import { AppShell as AppShellMantine, ScrollArea } from '@mantine/core'
import type { FC, ReactNode } from 'react'
import { useAside, useFooter, useHeader, useNavbar } from './context'

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
  main: { padding: 0, width: '100%', height: '100%', minHeight: 'auto' },
}

export const AppShell: FC<{ children: ReactNode }> = (props) => {
  const Header = useHeader()
  const Footer = useFooter()
  const Navbar = useNavbar()
  const Aside = useAside()

  return (
    <AppShellMantine
      styles={styles}
      fixed={false}
      header={<Header />}
      footer={<Footer />}
      navbar={<Navbar />}
      aside={<Aside />}
    >
      <ScrollArea type='always' style={{ height: '100%' }}>
        {props.children}
      </ScrollArea>
    </AppShellMantine>
  )
}
