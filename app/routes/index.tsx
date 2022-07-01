import { Anchor, Center, Container } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

export default function Index() {
  return (
    <Container>
      <Center>
        <Anchor component={Link} to="/posts" underline>
          Blog Posts
        </Anchor>
      </Center>
    </Container>
  );
}
