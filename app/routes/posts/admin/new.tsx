import { Button, Grid, Textarea, TextInput } from "@mantine/core";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { array, record, tuple } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Option } from "fp-ts/lib/Option";
import type { TypeOf } from "io-ts";
import { type } from "io-ts";
import { createPost } from "~/models/post.server";
import { fontFamily } from "~/util/css";
import {
  NonEmptyStringStrict,
  Validator,
  viewErrorMessage,
} from "~/util/io-ts-helper";
import { trimFormDataEntryValue } from "~/util/remix-helper";

const formDateC = type({
  title: NonEmptyStringStrict,
  slug: NonEmptyStringStrict,
  markdown: NonEmptyStringStrict,
});

type FormData = TypeOf<typeof formDateC>;

type ActionData = {
  error: Partial<Record<keyof FormData, Option<string>>>;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const post = pipe(
    Array.from(formData.entries()),
    array.map(tuple.mapSnd(trimFormDataEntryValue)),
    record.fromEntries,
    record.map(trimFormDataEntryValue)
  );

  const postValidator = new Validator(formDateC);
  if (postValidator.validate(post)) {
    await createPost(post);
    return redirect("/posts/admin");
  } else {
    return json<ActionData>({
      error: postValidator.error,
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
            error={viewErrorMessage(ad?.error.title)}
            required
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            type="text"
            name="slug"
            label="Post Slug"
            error={viewErrorMessage(ad?.error.slug)}
            required
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            name="markdown"
            label="Markdown"
            error={viewErrorMessage(ad?.error.markdown)}
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
