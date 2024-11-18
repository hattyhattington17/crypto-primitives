import { Field } from "o1js";
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
export function fieldToBinaryArray(input, length) {
    const binaryString = input.toBigInt().toString(2).padStart(length, '0');
    return binaryString.split('').map(bit => Field(parseInt(bit, 10)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluYXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3V0aWwvQmluYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0I7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsS0FBWSxFQUFFLE1BQWM7SUFDN0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsQ0FBQyJ9