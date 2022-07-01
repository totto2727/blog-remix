import {
  Anchor,
  Center,
  Container,
  Grid,
  List,
  Navbar,
  Stack,
  Title,
} from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  return json({ posts: await getPosts() });
};

export default function PostAdmin() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <Container size={896}>
      <Center>
        <Stack style={{ width: "100%" }}>
          <Title
            order={1}
            mt={24}
            mb={2}
            align="center"
            style={{ borderBottom: "2px solid black" }}
          >
            Blog Admin
          </Title>
          <Grid gutter={24}>
            <Grid.Col span={12} md={4}>
              <Navbar style={{ border: 0, height: "auto" }}>
                <Navbar.Section>
                  <List type="ordered">
                    {posts.map((post) => (
                      <List.Item key={post.slug}>
                        <Anchor component={Link} to={post.slug} underline>
                          {post.title}
                        </Anchor>
                      </List.Item>
                    ))}
                  </List>
                </Navbar.Section>
              </Navbar>
            </Grid.Col>
            <Grid.Col span={12} md={8}>
              <main>
                <Outlet />
              </main>
            </Grid.Col>
          </Grid>
        </Stack>
      </Center>
    </Container>
  );
}
