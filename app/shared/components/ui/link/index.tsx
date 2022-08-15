import type { AnchorProps } from '@mantine/core'
import { Anchor } from '@mantine/core'
import type { PolymorphicComponentProps } from '@mantine/utils'

import { Link as RemixLink } from '@remix-run/react'

export const Link = (
  props: PolymorphicComponentProps<typeof RemixLink, AnchorProps>
) => <Anchor component={RemixLink} {...props} />
