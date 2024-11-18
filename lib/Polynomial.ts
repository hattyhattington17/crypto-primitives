import { Field, Provable } from "o1js";
import { Vector } from "./Vector.ts";
import { fieldToBinaryVector } from "./util/Binary.ts";

export enum Basis {
  StandardMonomial,
  UnivariateLagrange,
  MultilinearLagrange,
}

/**
 * A polynomial represented as the inner product of a coefficient vector and a basis vector
 */
export class Polynomial {
  /**
   * The basis type - basis vector is implicit based on type
   */
  private readonly basis: Basis;

  /**
   * Coefficient vector
   * */
  private readonly coefficients: Vector;

  constructor(coefficients: Vector, basis: Basis) {
    if (coefficients.getLength() === 0)
      throw Error(
        "Cannot initialize a polynomial from an empty coefficient vector.",
      );

    this.coefficients = coefficients;
    this.basis = basis;
  }

  /**
   * Evaluate the polynomial at a field element or vector
   * */
  evaluate(r: Field | Vector): Field {
    // only polynomials expressed over the multilinear lagrange basis can be evaluated at a vector
    if (this.basis === Basis.MultilinearLagrange) {
      // check that r is a vector
      if (r instanceof Vector) {
        return this.evaluateMultilinearLagrange(r);
      }
    } else if (this.basis === Basis.UnivariateLagrange) {
      if (r instanceof Field) {
        return this.evaluateUnivariateLagrange(r);
      }
    } else if (this.basis === Basis.StandardMonomial) {
      if (r instanceof Field) {
        return this.evaluateStandardMonomial(r);
      }
    }
    throw new Error("Unrecognized Polynomial");
  }

  /**
   * Evaluates a polynomial represented in the univariate Lagrange basis.
   * @param r - The field element at which to evaluate the polynomial.
   */
  private evaluateUnivariateLagrange(r: Field): Field {
    let innerProduct = Field(0);

    // compute the ith lagrange basis polynomial evaluated at r
    // for r in {0...n-1} returns coefficients[r]
    for (let i = 0; i < this.coefficients.getLength(); i++) {
      innerProduct = innerProduct.add(
        this.coefficients
          .getEntry(i)
          .mul(getUnivariateLagrange(i, this.coefficients.getLength(), r)),
      );
    }

    function getUnivariateLagrange(i: number, n: number, r: Field): Field {
      let product = Field(1);
      for (let j = 0; j < n; j++) {
        if (j === i) continue;

        const numerator = r.sub(j);
        const denominator = Field(i - j);

        product = product.mul(numerator.div(denominator));
      }
      return product;
    }

    return innerProduct;
  }

  /**
   * Evaluates a polynomial represented in the multilinear Lagrange basis.
   *  if r in {0,1}^v, returns the corresponding entry in the coefficients vector
   *
   * @param r - The vector at which to evaluate the polynomial.
   */
  private evaluateMultilinearLagrange(r: Vector): Field {
    // number of bits required to represent all binary indices of entries in the coefficient vector
    const v = Math.ceil(Math.log2(this.coefficients.getLength()));
    if (r.getLength() !== v) {
      throw new Error("Input vector must have length ceil(log_2(n))");
    }

    let innerProduct = Field(0);

    // evaluate the wth lagrange basis polynomial at r where w is a v-dimensional binary vector encoding the index i
    for (let i = 0; i < this.coefficients.getLength(); i++) {
      const w = fieldToBinaryVector(Field(i), v);
      const term = this.coefficients
        .getEntry(i)
        .mul(getMultilinearLagrange(w, v, r));
      innerProduct = innerProduct.add(term);
    }

    function getMultilinearLagrange(w: Vector, v: number, r: Vector): Field {
      let product = Field(1);

      // loop through each entry in the wth vector
      for (let i = 0; i < v; i++) {
        const w_i = w.getEntry(i);
        const r_i = r.getEntry(i);

        // (w_j * x_j) + (1-w_j)(1-x_j)
        const term = w_i.mul(r_i).add(Field(1).sub(w_i).mul(Field(1).sub(r_i)));
        product = product.mul(term);
      }
      return product;
    }

    return innerProduct;
  }

  /**
   * Evaluates a polynomial represented in the standard monomial basis.
   * @param r - The field element at which to evaluate the polynomial.
   */
  private evaluateStandardMonomial(r: Field): Field {
    // take inner product of vector against r on the standard monomial basis
    // work in reverse order to build the standard monomial basis one power of r at a time
    let innerProd = Field(0);
    // initialize the final entry in the standard basis vector to r^0
    let basis = Provable.if(r.equals(0), Field(0), Field(1));
    for (let i = this.coefficients.getLength() - 1; i >= 0; i--) {
      // coeff is this.entries[i]
      innerProd = innerProd.add(this.coefficients.getEntry(i).mul(basis));
      // with each round, update the basis entry to a higher power of r
      basis = basis.mul(r);
    }
    return innerProd;
  }
}
