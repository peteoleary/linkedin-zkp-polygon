pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/comparators.circom";

template Loan() {
    signal input income;
    signal input guard;
    
    signal output incomeOk;
    signal output guardOk;

    component isEq = IsEqual();

    isEq.in[0] <-- guard;
    isEq.in[1] <-- 0x1234567890abcdef;

    guardOk <== isEq.out;

    component gt32 = GreaterThan(32);

    gt32.in[0] <-- income;
    gt32.in[1] <-- 200000;

    incomeOk <== gt32.out;
 }

 component main = Loan();
