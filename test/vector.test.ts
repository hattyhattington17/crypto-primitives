import { Field } from "o1js";
import { fieldToBinaryVector } from "../lib/util/Binary.ts";
import { Vector } from "../lib/Vector.ts";
import { Basis } from "../lib/Polynomial.ts";

describe("Vector", () => {
  it("Should create a new vector with the given entries", () => {
    const entries = [1, 2, 3].map((e) => Field(e));
    const vector = new Vector(entries);
    expect(vector.getLength()).toEqual(3);

    expect(vector.getEntry(0)).toEqual(Field(entries[0]));
    expect(vector.getEntry(1)).toEqual(Field(entries[1]));
    expect(vector.getEntry(2)).toEqual(Field(entries[2]));
  });

  describe("Polynomial conversion", () => {
    it("Should error on an empty vector", () => {
      const vector = new Vector([]);
      expect(() => {
        vector.toPolynomial(Basis.StandardMonomial);
      }).toThrow(
        "Cannot initialize a polynomial from an empty coefficient vector.",
      );
    });
  });

  describe("Reed-Solomon codes", () => {
    it("Should compute Reed-Solomon code entries for the vector (1,2,3)", () => {
      const entries = [1, 2, 3].map((e) => Field(e));
      const vector = new Vector(entries);

      // v = (1, 2, 3), n = 3
      // polynomial is P(x) = 1 * (x^2) + 2 * (x^1) + 3 * (x^0)
      expect(vector.computeReedSolomonCodeEntry(Field(0))).toEqual(Field(0));
      expect(vector.computeReedSolomonCodeEntry(Field(1))).toEqual(Field(6));
      expect(vector.computeReedSolomonCodeEntry(Field(2))).toEqual(Field(11));
      expect(vector.computeReedSolomonCodeEntry(Field(3))).toEqual(Field(18));
      expect(vector.computeReedSolomonCodeEntry(Field(4))).toEqual(Field(27));
      expect(vector.computeReedSolomonCodeEntry(Field(5))).toEqual(Field(38));
      expect(vector.computeReedSolomonCodeEntry(Field(50))).toEqual(
        Field(2603),
      );
    });
    it("Should compute Reed-Solomon code entries for the vector (0, 10, 2, 9)", () => {
      const entries = [0, 10, 2, 9].map((e) => Field(e));
      const vector = new Vector(entries);

      // v = (0, 10, 2, 9), n = 4
      // polynomial is P(x) = 0 * (x^3) + 10 * (x^2) + 2 * (x^1) + 9 * (x^0)
      expect(vector.computeReedSolomonCodeEntry(Field(0))).toEqual(Field(0));
      expect(vector.computeReedSolomonCodeEntry(Field(1))).toEqual(Field(21));
      expect(vector.computeReedSolomonCodeEntry(Field(2))).toEqual(Field(53));
      expect(vector.computeReedSolomonCodeEntry(Field(3))).toEqual(Field(105));
      expect(vector.computeReedSolomonCodeEntry(Field(30))).toEqual(
        Field(9069),
      );
    });
    it("Should error on an empty vector", () => {
      const vector = new Vector([]);
      expect(() => {
        vector.computeReedSolomonCodeEntry(Field(0));
      }).toThrow(
        "Cannot initialize a polynomial from an empty coefficient vector.",
      );
    });
  });
  describe("Low-degree extension codes (univariate Lagrange interpolation", () => {
    // Compute Lagrange polynomials with https://www.dcode.fr/lagrange-interpolating-polynomial
    it("Should return the corresponding entry in the vector when called with an input between 0 and the vector length", () => {
      const vector1 = new Vector([1, 2, 3, 4, 5].map((e) => Field(e)));
      expect(vector1.computeLowDegreeExtensionEntry(Field(0))).toEqual(
        Field(1),
      );
      expect(vector1.computeLowDegreeExtensionEntry(Field(1))).toEqual(
        Field(2),
      );
      expect(vector1.computeLowDegreeExtensionEntry(Field(2))).toEqual(
        Field(3),
      );
      expect(vector1.computeLowDegreeExtensionEntry(Field(3))).toEqual(
        Field(4),
      );
      expect(vector1.computeLowDegreeExtensionEntry(Field(4))).toEqual(
        Field(5),
      );

      expect(vector1.computeLowDegreeExtensionEntry(Field(50))).toEqual(
        Field(51),
      );

      const vector2 = new Vector(
        [0, 10, 2, 9, 53, 55, 0, 2].map((e) => Field(e)),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(0))).toEqual(
        Field(0),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(1))).toEqual(
        Field(10),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(2))).toEqual(
        Field(2),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(3))).toEqual(
        Field(9),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(4))).toEqual(
        Field(53),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(5))).toEqual(
        Field(55),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(6))).toEqual(
        Field(0),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(7))).toEqual(
        Field(2),
      );
    });

    it("Should correctly evaluate the univariate lagrange polynomial when called with an input GTE the vector length", () => {
      const vector1 = new Vector([1, 2, 3, 4, 5].map((e) => Field(e)));
      expect(vector1.computeLowDegreeExtensionEntry(Field(50))).toEqual(
        Field(51),
      );

      const vector2 = new Vector(
        [0, 10, 2, 9, 53, 55, 0, 2].map((e) => Field(e)),
      );

      expect(vector2.computeLowDegreeExtensionEntry(Field(8))).toEqual(
        Field(86).neg(),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(9))).toEqual(
        Field(1872).neg(),
      );
      expect(vector2.computeLowDegreeExtensionEntry(Field(10))).toEqual(
        Field(10790).neg(),
      );
    });

    it("Should throw an error for an empty vector", () => {
      const vector = new Vector([]);
      expect(() => {
        vector.computeLowDegreeExtensionEntry(Field(0));
      }).toThrow(
        "Cannot initialize a polynomial from an empty coefficient vector.",
      );
    });
  });
  describe("Multilinear extension codes (multivariate Lagrange interpolation)", () => {
    it("Should error on the wrong number of inputs", () => {
      // 10 entries requires ceil(log_2_10) inputs to encode all indices in binary
      const entries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => Field(e));
      const vector = new Vector(entries);
      const inputs = new Vector([1].map((e) => Field(e)));
      expect(() => {
        vector.computeMultilinearExtensionEntry(inputs);
      }).toThrow("Input vector must have length ceil(log_2(n))");
    });
    it("Should return corresponding vector entries for inputs in {0,1}^v", () => {
      const entries1 = [1, 2, 3, 4, 5].map((e) => Field(e));
      const vector1 = new Vector(entries1);
      // 3 bits to represent indices 0-7 which
      // this is the lowest number of bits that can store the 5 entry vector
      const bits1 = Math.ceil(Math.log2(entries1.length));
      // returns entries in the original vector for binary encoded indices less than the vector length
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(0), bits1),
        ),
      ).toEqual(Field(1));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(1), bits1),
        ),
      ).toEqual(Field(2));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(2), bits1),
        ),
      ).toEqual(Field(3));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(3), bits1),
        ),
      ).toEqual(Field(4));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(4), bits1),
        ),
      ).toEqual(Field(5));
      const entries2 = [0, 10, 2, 9, 53, 55, 0, 2, 0].map((e) => Field(e));
      const vector2 = new Vector(entries2);
      // returns vector entries for input vectors v in {0,1}^v
      // 4 bits to represent indices 0-15, lowest number of bits that can represent all indices of a vector of length 9
      const bits2 = Math.ceil(Math.log2(entries2.length));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(0), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(1), bits2),
        ),
      ).toEqual(Field(10));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(2), bits2),
        ),
      ).toEqual(Field(2));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(3), bits2),
        ),
      ).toEqual(Field(9));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(4), bits2),
        ),
      ).toEqual(Field(53));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(5), bits2),
        ),
      ).toEqual(Field(55));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(6), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(7), bits2),
        ),
      ).toEqual(Field(2));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(8), bits2),
        ),
      ).toEqual(Field(0));
    });
    it("Should return 0 for inputs in the {0,1}^v that do not correspond to a vector entry", () => {
      const entries1 = [1, 2, 3, 4, 5].map((e) => Field(e));
      const vector1 = new Vector(entries1);
      const bits1 = Math.ceil(Math.log2(entries1.length));
      // returns 0 for binary encoded indices 5-7 which do not correspond to vector entries
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(5), bits1),
        ),
      ).toEqual(Field(0));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(6), bits1),
        ),
      ).toEqual(Field(0));
      expect(
        vector1.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(7), bits1),
        ),
      ).toEqual(Field(0));

      const entries2 = [0, 10, 2, 9, 53, 55, 0, 2, 0].map((e) => Field(e));
      const vector2 = new Vector(entries2);
      // returns vector entries for input vectors v in {0,1}^v
      // 4 bits to represent indices 0-15, lowest number of bits that can represent all indices of a vector of length 9
      const bits2 = Math.ceil(Math.log2(entries2.length));
      // returns 0 for binary encoded indices 9-15 which do not correspond to vector entries
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(9), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(10), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(11), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(12), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(13), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(14), bits2),
        ),
      ).toEqual(Field(0));
      expect(
        vector2.computeMultilinearExtensionEntry(
          fieldToBinaryVector(Field(15), bits2),
        ),
      ).toEqual(Field(0));
    });
    it("Should return same univariate low degree and multilinear extension evaluations for 2 entry vectors (v = 1)", () => {
      const entries1 = [9, 3].map((e) => Field(e));
      const vector1 = new Vector(entries1);
      expect(
        vector1.computeMultilinearExtensionEntry(new Vector([Field(0)])),
      ).toEqual(vector1.computeLowDegreeExtensionEntry(Field(0)));
      expect(
        vector1.computeMultilinearExtensionEntry(new Vector([Field(10)])),
      ).toEqual(vector1.computeLowDegreeExtensionEntry(Field(10)));
      expect(
        vector1.computeMultilinearExtensionEntry(new Vector([Field(100)])),
      ).toEqual(vector1.computeLowDegreeExtensionEntry(Field(100)));

      const entries2 = [0, 0].map((e) => Field(e));
      const vector2 = new Vector(entries2);
      expect(
        vector2.computeMultilinearExtensionEntry(new Vector([Field(0)])),
      ).toEqual(vector2.computeLowDegreeExtensionEntry(Field(0)));
      expect(
        vector2.computeMultilinearExtensionEntry(new Vector([Field(10)])),
      ).toEqual(vector2.computeLowDegreeExtensionEntry(Field(10)));
      expect(
        vector2.computeMultilinearExtensionEntry(new Vector([Field(100)])),
      ).toEqual(vector2.computeLowDegreeExtensionEntry(Field(100)));
    });
    it("Should return the correct multilinear extension for inputs in F^v", () => {
      // see mle-worked-example.md for how these values were computed
      const entries1 = [1, 2, 3].map((e) => Field(e));
      const vector1 = new Vector(entries1);

      expect(
        vector1.computeMultilinearExtensionEntry(
          new Vector([Field(100), Field(100)]),
        ),
      ).toEqual(Field(39699).neg());
      expect(
        vector1.computeMultilinearExtensionEntry(
          new Vector([Field(435), Field(1)]),
        ),
      ).toEqual(Field(868).neg());
      expect(
        vector1.computeMultilinearExtensionEntry(
          new Vector([Field(1), Field(435)]),
        ),
      ).toEqual(Field(1302).neg());

      const entries2 = [3, 43, 19, 23].map((e) => Field(e));
      const vector2 = new Vector(entries2);

      expect(
        vector2.computeMultilinearExtensionEntry(
          new Vector([Field(100), Field(100)]),
        ),
      ).toEqual(Field(354397).neg());
      expect(
        vector2.computeMultilinearExtensionEntry(
          new Vector([Field(2354), Field(2)]),
        ),
      ).toEqual(Field(131741).neg());
      expect(
        vector2.computeMultilinearExtensionEntry(
          new Vector([Field(2), Field(2354)]),
        ),
      ).toEqual(Field(75293).neg());
    });
    it("Should compute Multilinear extension code entries for an empty vector", () => {
      const vector = new Vector([]);
      expect(() => {
        vector.computeMultilinearExtensionEntry(new Vector([]));
      }).toThrow(
        "Cannot initialize a polynomial from an empty coefficient vector.",
      );
    });
  });
});
