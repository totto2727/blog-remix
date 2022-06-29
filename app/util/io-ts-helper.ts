import { isRight } from "fp-ts/lib/Either";
import type { Branded, Type, TypeOf } from "io-ts";
import { brand } from "io-ts";
import { NonEmptyString } from "io-ts-types";
import { PathReporter } from "io-ts/lib/PathReporter";
import invariant from "tiny-invariant";

export const createTypeChecker =
  <T>(typeC: Type<T, T, unknown>) =>
  (x: unknown): x is T =>
    isRight(typeC.decode(x));

type InvariantCodec = <T, O = T>(
  codec: Type<T, O, unknown>,
  x: unknown
) => asserts x is O;
export const invariantCodec: InvariantCodec = (codec, x) => {
  const validation = codec.decode(x);
  invariant(isRight(validation), PathReporter.report(validation).join("\n"));
};

const PATH_REPORT_KEY_REGEXP = /\/(.+):(.+)$/;

export class TypeChecker<A extends object, O = A> {
  private _codec: Type<A, O, unknown>;
  private _report?: Partial<{
    [key in keyof TypeOf<Type<A, O, unknown>>]: string;
  }>;

  constructor(codec: Type<A, O, unknown>) {
    this._codec = codec;
  }

  validate = (x: unknown): x is O => {
    const validate = this._codec.decode(x);
    const reports = PathReporter.report(validate);
    if (isRight(validate)) return true;

    const errors = Object.fromEntries(
      reports
        .map((report) => {
          const regexp = new RegExp(PATH_REPORT_KEY_REGEXP);
          const result = report.match(regexp);
          if (result?.length) {
            return [result[1], report] as const;
          }
          return [undefined, undefined] as const;
        })
        .filter(([x, y]) => x && y)
    );
    this._report = errors as unknown as Partial<{
      [key in keyof TypeOf<Type<A, O, unknown>>]: string;
    }>;

    return false;
  };

  get report() {
    return this._report;
  }
}

interface INonEmptyStringStrict {
  readonly NonEmptyStringStrict: unique symbol;
}
export const NonEmptyStringStrict = brand(
  NonEmptyString,
  (n): n is Branded<NonEmptyString, INonEmptyStringStrict> => n.trim() === n,
  "NonEmptyStringStrict"
);
