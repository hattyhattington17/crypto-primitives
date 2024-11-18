import { Field } from "o1js";
import { Basis, Polynomial } from "./Polynomial.ts";

/**
 * Represents a vector of field elements
 */
export class Vector {
  /**
   * The entries of the vector.
   */
  private readonly entries: Field[];

  /**
   * Creates a new Vector instance.
   *
   * @param entries - The entries of the vector.
   */
  constructor(entries: Field[]) {
    this.entries = entries;
  }

  /**
   * Returns the entry at the specified index.
   *
   * @param index - The index of the entry to return.
   * @returns The entry at the specified index.
   */
  public getEntry(index: number): Field {
    if (index < 0 || index >= this.entries.length)
      throw new Error("Index out of bounds");
    return this.entries[index];
  }

  /**
   * Returns the length n of the vector
   *
   * @returns The length of the vector.
   */
  public getLength(): number {
    return this.entries.length;
  }

  /**
   * Computes an entry in the Reed-Solomon code for the vector.
   *
   * @param r - The point at which to evaluate the polynomial.
   * @returns The entry in the Reed-Solomon code at the specified point.
   */
  public computeReedSolomonCodeEntry(r: Field): Field {
    return this.toPolynomial(Basis.StandardMonomial).evaluate(r);
  }

  /**
   * Creates a polynomial using the vector as coefficients over the supplied basis
   *
   * @param basis - The basis over which to apply the current vector as coefficients
   * @returns a polynomial that is the inner product of the current vector and the basis vectors
   * */
  toPolynomial(basis: Basis): Polynomial {
    return new Polynomial(this, basis);
  }

  /**
   * Computes an entry in the low-degree extension encoding of the vector.
   *
   * @param r - The point at which to evaluate the polynomial.
   * @returns The entry in the low-degree extension encoding at the specified point.
   */
  public computeLowDegreeExtensionEntry(r: Field): Field {
    return this.toPolynomial(Basis.UnivariateLagrange).evaluate(r);
  }

  /**
   * Computes an entry in the multilinear extension encoding of the vector.
   * Input vector length must be equal to the number of bits required to represent the indices of each entry in the vector
   *
   * @param evaluationVector - The vector at which to evaluate the multilinear polynomial.
   * @returns The entry in the multilinear extension encoding at the specified point.
   */
  public computeMultilinearExtensionEntry(evaluationVector: Vector): Field {
    return this.toPolynomial(Basis.MultilinearLagrange).evaluate(
      evaluationVector,
    );
  }

  toString() {
    return this.entries.map((entry) => entry.toString()).join(", ");
  }
}
