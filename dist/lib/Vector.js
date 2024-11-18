import { Field } from "o1js";
/**
 * Represents a vector of field elements
 */
export class Vector {
    /**
     * Creates a new Vector instance.
     *
     * @param entries - The entries of the vector.
     */
    constructor(entries) {
        this.entries = entries;
    }
    /**
     * Returns the entry at the specified index.
     *
     * @param index - The index of the entry to return.
     * @returns The entry at the specified index.
     */
    getEntry(index) {
        if (index < 0 || index >= this.entries.length)
            throw new Error("Index out of bounds");
        return this.entries[index];
    }
    /**
     * Returns the length of the vector.
     *
     * @returns The length of the vector.
     */
    getLength() {
        return this.entries.length;
    }
    /**
     * Computes an entry in the Reed-Solomon code for the vector.
     *
     * @param evaluationPoint - The point at which to evaluate the polynomial.
     * @returns The entry in the Reed-Solomon code at the specified point.
     */
    computeReedSolomonCodeEntry(evaluationPoint) {
        if (this.entries.length === 0)
            throw Error("Empty vector.");
        // TODO: Implement the computation of a Reed-Solomon code entry.
        // This will likely involve interpreting the vector entries as coefficients of a polynomial
        // and evaluating that polynomial at the specified point.
        return Field(0);
    }
    /**
     * Computes an entry in the low-degree extension encoding of the vector.
     *
     * @param evaluationPoint - The point at which to evaluate the polynomial.
     * @returns The entry in the low-degree extension encoding at the specified point.
     */
    computeLowDegreeExtensionEntry(evaluationPoint) {
        if (this.entries.length === 0)
            throw Error("Empty vector.");
        // TODO: Implement the computation of a low-degree extension entry.
        // This will involve interpolating a polynomial that passes through the points defined by the vector
        // and evaluating that polynomial at the specified point.
        return Field(0);
    }
    /**
     * Computes an entry in the multilinear extension encoding of the vector.
     *
     * @param evaluationVector - The vector at which to evaluate the multilinear polynomial.
     * @returns The entry in the multilinear extension encoding at the specified point.
     */
    computeMultilinearExtensionEntry(evaluationVector) {
        if (this.entries.length === 0)
            throw Error("Empty vector.");
        // number of bits required to encode all indices of the vector entries
        const v = Math.ceil(Math.log2(this.entries.length));
        if (evaluationVector.getLength() !== v) {
            throw new Error(`Evaluation point vector must have length ${v}`);
        }
        // TODO: Implement the computation of a multilinear extension entry.
        // This will involve constructing a multilinear polynomial that agrees with the vector
        // on the Boolean hypercube and evaluating that polynomial at the specified point.
        return Field(0);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL1ZlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE1BQU07SUFNakI7Ozs7T0FJRztJQUNILFlBQVksT0FBZ0I7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLEtBQWE7UUFDM0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdEYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksU0FBUztRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksMkJBQTJCLENBQUMsZUFBc0I7UUFDdkQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDNUQsZ0VBQWdFO1FBQ2hFLDJGQUEyRjtRQUMzRix5REFBeUQ7UUFDekQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksOEJBQThCLENBQUMsZUFBc0I7UUFDMUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDNUQsbUVBQW1FO1FBQ25FLG9HQUFvRztRQUNwRyx5REFBeUQ7UUFDekQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksZ0NBQWdDLENBQUMsZ0JBQXdCO1FBQzlELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVELHNFQUFzRTtRQUN0RSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FDYiw0Q0FBNEMsQ0FBQyxFQUFFLENBQ2hELENBQUM7UUFDSixDQUFDO1FBQ0Qsb0VBQW9FO1FBQ3BFLHNGQUFzRjtRQUN0RixrRkFBa0Y7UUFDbEYsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUVGIn0=