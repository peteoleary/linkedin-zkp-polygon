pragma circom 2.0.3;

template Loan() {
    signal input a;
    signal input b;
    signal output result;
    result <== a*b;
 }

 component main = Loan();
