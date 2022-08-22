import '@relmify/jest-fp-ts'
import { expect } from 'vitest'
import { NonEmptyStringStrict } from './non-empty-string-strict'

describe('NonEmptyStringStrict', () => {
  it('NonEmptyStrict', () =>
    expect(NonEmptyStringStrict.decode('NonEmptyStrict')).toBeRight())
  it('NonEmpty', () => expect(NonEmptyStringStrict.decode(' 　 ')).toBeLeft())
  it('Empty', () => expect(NonEmptyStringStrict.decode('')).toBeLeft())
})
