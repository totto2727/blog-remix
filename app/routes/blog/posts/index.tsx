import { sanitizeUrl } from '@braintree/sanitize-url'
import { Container, FloatingTooltip, Grid, Title } from '@mantine/core'
import type { Post } from '@prisma/client'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isRight } from 'fp-ts/lib/Either'
import { TitleCard } from '~/features/blog/components/ui/TitleCard'
import { getPosts } from '~/features/blog/models/post/index.server'
import { Link } from '~/shared/components/ui/link'

type LoaderData = {
  posts: Post[]
}

export const loader = async () => {
  const ok = await getPosts()
  if (isRight(ok)) {
    return json<LoaderData>({ posts: ok.right })
  } else {
    throw ok.left
  }
}

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>()
  return (
    <Container>
      <Title order={1} align='center' style={{ marginBottom: '1rem' }}>
        記事一覧
      </Title>
      <Grid>
        {posts.map((post) => (
          <Grid.Col span={6} key={post.slug}>
            <Link
              to={sanitizeUrl(post.slug)}
              style={{ textDecoration: 'none' }}
            >
              <FloatingTooltip label={post.title} style={{ width: '100%' }}>
                <TitleCard
                  title={post.title}
                  image='https://cdn.pixabay.com/photo/2022/06/27/10/58/mount-kilimanjaro-7287226_1280.jpg'
                  datetime={post.updatedAt}
                ></TitleCard>
              </FloatingTooltip>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
