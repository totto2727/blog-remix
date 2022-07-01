import { Anchor } from "@mantine/core";
import { Link } from "@remix-run/react";

export default function AdminIndex() {
  return (
    <Anchor component={Link} to="new" className="text-blue-600 underline">
      Create a New Post
    </Anchor>
  );
}
