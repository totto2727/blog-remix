import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { supabase } from '~/shared/configs/supabase'
import { supabaseFetch } from '~/shared/libs/supabase-helper'
import type { Post } from '.'

export async function getPosts() {
  return await pipe(
    TE.tryCatch(
      supabaseFetch(supabase.from<Post>('post').select('*')),
      (reason: unknown) => reason
    )
  )()
}

export async function getPublishedPosts() {
  return await pipe(
    TE.tryCatch(
      supabaseFetch(
        supabase.from<Post>('post').select('*').eq('status', 'publish')
      ),
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
