import { pipe } from 'fp-ts/lib/function'
import { supabase } from '~/shared/configs/supabase'
import { TE } from '~/shared/libs/fp-ts'
import { query } from '~/shared/libs/supabase'
import type { Post } from '.'

export async function getPosts() {
  return await pipe(
    TE.tryCatch(
      query(supabase.from<Post>('post').select('*')),
      (reason: unknown) => reason
    )
  )()
}

export async function getPublishedPosts() {
  return await pipe(
    TE.tryCatch(
      query(supabase.from<Post>('post').select('*').eq('status', 'publish')),
      (reason: unknown) => reason
    )
  )()
}

// export async function getPost(slug: string) {
//   return await pipe(
//     TE.tryCatch(
//       () => prisma.post.findUniqueOrThrow({ where: { slug } }),
//       (reason: unknown) => reason
//     )
//   )()
// }

// export async function createPost(
//   post: Pick<Post, 'slug' | 'title' | 'markdown'>
// ) {
//   return prisma.post.create({ data: post })
// }

// export async function updatePost({
//   slug,
//   ...post
// }: Pick<Post, 'slug' | 'title' | 'markdown'>) {
//   return prisma.post.update({ where: { slug }, data: post })
// }
