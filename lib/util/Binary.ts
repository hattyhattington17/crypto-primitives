import { Field } from "o1js";
import { Vector } from "../Vector.ts";
/**
 * Converts a given `Field` element into a binary array of `Field` elements with a specified length.
 * Each bit of the binary representation is represented as a `Field` element (0 or 1).
 *
 * @param input - The `Field` element to convert to a binary array.
 * @param length - The desired length of the output array. The binary array will be padded with leading zeros if necessary.
 * @returns An array of `Field` elements representing the binary form of the input number.
 *
 * @example
 * ```typescript
 * const num = Field(5);
 * const binaryFieldArray = numberToBinaryFieldArray(num, 8);
 * // binaryFieldArray will contain Field elements representing [0, 0, 0, 0, 0, 1, 0, 1]
 * ```
 */
export function fieldToBinaryVector(input: Field, length: number): Vector {
  const binaryString = input.toBigInt().toString(2).padStart(length, "0");
  return new Vector(
    binaryString.split("").map((bit) => Field(parseInt(bit, 10))),
  );
}
