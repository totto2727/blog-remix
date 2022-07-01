import { Anchor, Center, List, Stack, Title } from "@mantine/core";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

type LoaderData = {
  // this is a handy way to say: "posts is whatever type getPosts resolves to"
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main>
      <Center>
        <Stack>
          <Title order={1} align="center">
            Posts
          </Title>
          <Anchor component={Link} to="admin">
            Admin
          </Anchor>
          <List type="unordered">
            {posts.map((post) => (
              <List.Item key={post.slug}>
                <Anchor
                  component={Link}
                  to={post.slug}
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </Stack>
      </Center>
    </main>
  );
}
