import { Button, Grid, Textarea, TextInput } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { array, record, tuple } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { createPost } from "~/models/post.server";
import { fontFamily } from "~/util/css";
import { NonEmptyStringStrict, TypeChecker } from "~/util/io-ts-helper";
import { trimFormDataEntryValue } from "~/util/remix-helper";

const formDateP = {
  title: NonEmptyStringStrict,
  slug: NonEmptyStringStrict,
  markdown: NonEmptyStringStrict,
};

type ActionData = {
  errors: Partial<Record<keyof typeof formDateP, string>>;
  report: string[];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const post = pipe(
    Array.from(formData.entries()),
    array.map(tuple.mapSnd(trimFormDataEntryValue)),
    record.fromEntries,
    record.map(trimFormDataEntryValue)
  );

  const typeChecker = new TypeChecker(formDateP);
  if (typeChecker.validate(post)) {
    await createPost(post);
    return redirect("/posts/admin");
  } else {
    const errors = pipe(
      typeChecker.errors,
      record.mapWithIndex((k, _) => `${upperFirst(k)} is required`)
    );

    return json<ActionData>({
      errors,
      report: typeChecker.report,
    });
  }
};

export default function NewPost() {
  const ad = useActionData<ActionData>();

  return (
    <Form method="post">
      <Grid gutter={8}>
        <Grid.Col>
          <TextInput
            type="text"
            name="title"
            label="Post Title"
            error={ad?.errors.title}
            required
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            type="text"
            name="slug"
            label="Post Slug"
            error={ad?.errors.slug}
            required
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            name="markdown"
            label="Markdown"
            error={ad?.errors.markdown}
            required
            autosize
            styles={{
              input: {
                fontFamily: fontFamily.mono,
              },
            }}
          />
        </Grid.Col>
        <Grid.Col>
          <Button type="submit">Create Post</Button>
        </Grid.Col>
      </Grid>
    </Form>
  );
}
