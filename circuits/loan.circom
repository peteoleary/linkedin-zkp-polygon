pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/comparators.circom";

template Loan() {
    signal input income;
    signal output result;

    component gt32 = GreaterThan(32);

    gt32.in[0] <-- income;
    gt32.in[1] <-- 200000;

    result <== gt32.out;
 }

 component main = Loan();
