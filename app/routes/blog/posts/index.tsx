import { sanitizeUrl } from '@braintree/sanitize-url'
import { Box, Container, Grid, Title, Tooltip } from '@mantine/core'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { TitleCard } from '~/features/blog/components/ui/title-card'
import type { Post } from '~/features/blog/models/post'
import { getPublishedPosts } from '~/features/blog/models/post/index.server'
import { Link } from '~/shared/components/ui/link'
import { E } from '~/shared/libs/fp-ts'

type LoaderData = {
  posts: Post[]
}

export const loader = async () => {
  const ok = await getPublishedPosts()
  if (E.isRight(ok)) {
    return json<LoaderData>({ posts: ok.right })
  } else {
    throw ok.left
  }
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <Container>
      <Title order={1} align='center' style={{ marginBottom: '1rem' }}>
        記事一覧
      </Title>
      <Grid>
        {posts.map((post) => (
          <Grid.Col span={6} key={post.id}>
            <Link to={sanitizeUrl(post.id)} style={{ textDecoration: 'none' }}>
              <Tooltip.Floating label={post.title}>
                <Box>
                  <TitleCard
                    title={post.title}
                    image={sanitizeUrl(
                      'https://cdn.pixabay.com/photo/2022/06/27/10/58/mount-kilimanjaro-7287226_1280.jpg'
                    )}
                    datetime={new Date(post.updatedAt)}
                  />
                </Box>
              </Tooltip.Floating>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
