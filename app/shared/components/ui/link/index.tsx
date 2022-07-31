import type { AnchorProps } from '@mantine/core'
import { Anchor } from '@mantine/core'

import { Link as RemixLink } from '@remix-run/react'

export const Link = (props: AnchorProps<typeof RemixLink>) => (
  <Anchor component={RemixLink} {...props} />
)
