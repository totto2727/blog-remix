import { Outlet } from '@remix-run/react'
import { BlogHeader } from '~/features/blog/components/domain/blog-header'
import { AppShell } from '~/shared/components/ui/app-shell'
import { HeaderProvider } from '~/shared/components/ui/app-shell/context'

export default function Posts() {
  return (
    <HeaderProvider value={BlogHeader}>
      <AppShell>
        <Outlet />
      </AppShell>
    </HeaderProvider>
  )
}
