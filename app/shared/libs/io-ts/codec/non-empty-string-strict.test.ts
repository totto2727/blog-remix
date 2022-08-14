import { expect } from 'vitest'
import { NonEmptyStringStrict } from './non-empty-string-strict'
import '@relmify/jest-fp-ts'

describe('NonEmptyStringStrict', () => {
  it('NonEmptyStrict', () =>
    expect(NonEmptyStringStrict.decode('NonEmptyStrict')).toBeRight())
  it('NonEmpty', () => expect(NonEmptyStringStrict.decode(' 　 ')).toBeLeft())
  it('Empty', () => expect(NonEmptyStringStrict.decode('')).toBeLeft())
})
