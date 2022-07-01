import { isRight } from "fp-ts/lib/Either";
import type { Branded, Props, Type, TypeC, TypeOf } from "io-ts";
import { type } from "io-ts";
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

export class TypeChecker<A extends Props> {
  private _codec: TypeC<A>;
  private _errors: Partial<Record<string, string>> = {};
  private _report: string[] = [];

  constructor(props: A) {
    this._codec = type(props);
  }

  validate = (x: unknown): x is TypeOf<TypeC<A>> => {
    const validate = this._codec.decode(x);
    this._report = PathReporter.report(validate);
    if (isRight(validate)) return true;

    this._report.forEach((report) => {
      const regexp = new RegExp(PATH_REPORT_KEY_REGEXP);
      const result = report.match(regexp);
      if (result?.length) this._errors[result[1]] = report;
    });

    return false;
  };

  get report() {
    return this._report;
  }

  get errors() {
    return this._errors;
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
