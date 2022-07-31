import type { Post } from '@prisma/client'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { prisma } from '~/shared/configs/prisma'

export async function getPosts() {
  return await pipe(
    TE.tryCatch(
      () => prisma.post.findMany(),
      (reason: unknown) => reason
    )
  )()
}

export async function getPost(slug: string) {
  return await pipe(
    TE.tryCatch(
      () => prisma.post.findUniqueOrThrow({ where: { slug } }),
      (reason: unknown) => reason
    )
  )()
}

export async function createPost(
  post: Pick<Post, 'slug' | 'title' | 'markdown'>
) {
  return prisma.post.create({ data: post })
}

export async function updatePost({
  slug,
  ...post
}: Pick<Post, 'slug' | 'title' | 'markdown'>) {
  return prisma.post.update({ where: { slug }, data: post })
}
