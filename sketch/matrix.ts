// let m = new Matrix(3,2);


class Matrix {
  rows: any;
  cols: any;
  data: any[][];
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr:any[]) {
    return new Matrix(arr.length, 1).map((e:any, i:number) => arr[i]);
  }

  static subtract(a:any, b:any) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_:any, i:number, j:number) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map((e:any) => Math.random() * 2 - 1);
  }

  add(n:any) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e: any, i: number, j: number) => e + n.data[i][j]);
    } else {
      return this.map((e:any) => e + n);
    }
  }

  static transpose(matrix: Matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_: any, i: number, j:number) => matrix.data[j][i]);
  }

  static multiply(a: Matrix, b: Matrix) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e: any, i:number, j: number) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n: number | Matrix) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e: number, i:number, j:number) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map((e: number) => e * n);
    }
  }

  map(func:any) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix: Matrix, func: (arg0: any, arg1: any, arg2: any) => any) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e: any, i: number, j: number) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data:any) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}
