import {
  ActionIcon,
  Container,
  Group,
  Header,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { TbSun, TbMoonStars } from 'react-icons/tb'
import { notifyColorSchemeChange } from '~/shared/models/color-scheme'

export const BlogHeader = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const onClick = async () => {
    try {
      toggleColorScheme()
      await notifyColorSchemeChange()
    } catch {}
  }

  return (
    <Header height={'fit-content'}>
      <Container py={6}>
        <Group position='apart'>
          <Title order={1} align='left'>
            totto's Blog
          </Title>
          <ActionIcon
            variant='default'
            component='button'
            type='button'
            size={30}
            onClick={onClick}
          >
            {colorScheme === 'dark' ? (
              <TbSun size={16} />
            ) : (
              <TbMoonStars size={16} />
            )}
          </ActionIcon>
        </Group>
      </Container>
    </Header>
  )
}
