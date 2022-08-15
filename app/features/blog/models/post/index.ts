import * as t from 'io-ts'
import { date, UUID, withMessage } from 'io-ts-types'
import { NonEmptyStringStrict } from '~/shared/libs/io-ts'

const postStatusTypeC = t.union([
  t.literal('draft'),
  t.literal('publish'),
  t.literal('private'),
  t.literal('future'),
  t.literal('trash'),
])

const postC = t.type({
  id: withMessage(UUID, () => 'idはUUIDである必要があります'),
  title: NonEmptyStringStrict,
  content: withMessage(t.string, () => 'contentは文字列である必要があります'),
  status: withMessage(
    postStatusTypeC,
    () =>
      'statusはdraft, published, privatre, future, trashのいずれかである必要があります'
  ),
  createdAt: withMessage(date, () => 'created_atは日付である必要があります'),
  updatedAt: withMessage(date, () => 'updated_atは日付である必要があります'),
})

export type Post = t.TypeOf<typeof postC>
