# MLE Worked Example

## Multilinear extensions

Let $f: \\{0,1\\}^v \rightarrow \mathbb{F}$ be any function, then there is a unique multilinear polynomial $\tilde{f}$ that agrees with $f$ at all points on the boolean hypercube

$$
\tilde{f}(x_1,\dots,x_v) = \sum_{w \in \\{0,1\\}^v} f(w) \cdot L_w(x_1,\dots,x_v)
$$

Where $L_w$ is the multilinear Lagrange basis polynomial that evaluates to 1 for the vector $w$ and 0 for any other binary vector

$$
L_w(x_1,\dots,x_v) := \prod_{j=1}^{v} (w_j\cdot x_j) + (1-w_j)(1-x_j)
$$

Given the message vector $m = (1, 2, 3) \in \mathbb{F}_p^3$

- Pad the message so the length is a power of 2: $m = (1, 2, 3, 0) \in \mathbb{F}_p^4$
- Then the length $n=4$ and the number of variables required to represent binary indices of all entries in the message is $v = log_2(4) = 2$.
- Let $f(x) = m_{i+1}$ be a function where $x\in \\{0,1\\}^v$ is a vector encoding the binary representation of the index $i$.

$$
\tilde{f}(x_1, x_2) = \sum_{w \in \\{0,1\\}^2} f(w) \cdot L_w(x_1, x_2)
$$

- The sum is computed over $\\{0,1\\}^2  = \\{(0,0), (0,1), (1,0), (1,1))\\}$
- In terms of multilinear Lagrange basis polynomials $L_w$ we have
  $\tilde{f}(x_1, x_2) = f(0,0) \cdot L_{(0,0)}(x_1, x_2) + f(0,1) \cdot L_{(0,1)}(x_1, x_2) + f(1,0) \cdot L_{(1,0)}(x_1, x_2) + f(1,1) \cdot L_{(1,1)}(x_1, x_2)$
  $\tilde{f}(x_1, x_2) = m_1 \cdot L_{(0,0)}(x_1, x_2) + m_2 \cdot L_{(0,1)}(x_1, x_2) + m_3 \cdot L_{(1,0)}(x_1, x_2) + m_4 \cdot L_{(1,1)}(x_1, x_2)$
  $\tilde{f}(x_1, x_2) = 1 \cdot L_{(0,0)}(x_1, x_2) + 2 \cdot L_{(0,1)}(x_1, x_2) + 3 \cdot L_{(1,0)}(x_1, x_2) + 0 \cdot L_{(1,1)}(x_1, x_2)$

The Lagrange basis polynomials are:
$L_{(0,0)} = (0x_1 + (1-0)(1-x_1))(0x_2 + (1-0)(1-x_2)) = (1-x_1)(1-x_2)$
$L_{(0,1)} = (0 x_1 + (1-0)(1-x_1))(1 x_2 + (1-1)(1-x_2)) = (1-x_1)(x_2)$
$L_{(1,0)} = (1 x_1 + (1-1)(1-x_1))(0 x_2 + (1-0)(1-x_2)) = (x_1)(1-x_2)$
$L_{(1,1)} = (1 x_1 + (1-1)(1-x_1))(1 x_2 + (1-1)(1-x_2)) = (x_1)(x_2)$

So the expanded polynomial is

$$
\tilde{f}(x_1, x_2) = m_1(1-x_1)(1-x_2) + m_2(1-x_1)(x_2) + m_3(x_1)(1-x_2) + m_4(x_1)(x_2)
$$

$$
\tilde{f}(x_1, x_2) = 1(1-x_1)(1-x_2) + 2(1-x_1)(x_2) + 3(x_1)(1-x_2) + 0(x_1)(x_2)
$$

$$
\tilde{f}(x_1, x_2) = 1(1-x_1)(1-x_2) + 2(1-x_1)(x_2) + 3(x_1)(1-x_2)
$$
