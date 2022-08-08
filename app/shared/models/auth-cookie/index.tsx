import { createTypeChecker, Validator } from '~/shared/libs/io-ts-helper'
import * as t from 'io-ts'

export const authC = t.type({ access: t.string, refresh: t.string })
export type Auth = t.TypeOf<typeof authC>
export const validateAuthCookie = createTypeChecker(authC)
export const authValidator = new Validator(authC)
