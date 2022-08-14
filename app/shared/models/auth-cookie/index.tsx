import * as t from 'io-ts'
import { createValidateCodec, CodecValidator } from '~/shared/libs/io-ts'

export const authC = t.type({ access: t.string, refresh: t.string })
export type Auth = t.TypeOf<typeof authC>
export const validateAuthCookie = createValidateCodec(authC)
export const authValidator = new CodecValidator(authC)
