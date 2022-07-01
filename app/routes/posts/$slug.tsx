import { Center, Container, Stack, Title } from "@mantine/core";
import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import { string, type } from "io-ts";
import invariant from "tiny-invariant";
import { invariantCodec } from "~/util/io-ts-helper";
import { marked } from "marked";

type LoaderData = { post: Post; html: string };

const paramCodec = type({ slug: string });

export const loader: LoaderFunction = async ({ params }) => {
  invariantCodec(paramCodec, params);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData<LoaderData>();

  return (
    <main>
      <Center>
        <Stack>
          <Title order={1} align="center">
            {post.title}
          </Title>
          <Container dangerouslySetInnerHTML={{ __html: html }} />
        </Stack>
      </Center>
    </main>
  );
}
