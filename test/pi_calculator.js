// @ts-check

// https://conwaylife.com/book

const part1 = `
#COMPONENTS NOP,DIGITPRINTER_SE,B0-3,U0-9,ADD,SUB,MUL
#REGISTERS {"U1":1, "U6":6, "B0":2, "B2":1}
# State Input Next state Actions
# ---------------------------------------
INITIAL; ZZ; ITER1; NOP
# Iterate 4 times per digit.
ITER1; ZZ; ITER2; INC U5, NOP
ITER2; ZZ; ITER3; INC U5, NOP
ITER3; ZZ; ITER4; INC U5, NOP
ITER4; ZZ; ITER5; INC U5, NOP
ITER5; ZZ; ITER6; TDEC U5
# Each iteration, set U0 = U0 + 1, U1 = U1 + 2.
ITER6; Z;  ITER11; TDEC U3
ITER6; NZ; ITER7; INC U0, INC U1, NOP
ITER7; ZZ; MULA1; INC U1, NOP
## The MULA states set B3 = B1, B1 = U1 * B1.
# Copy B1 into B3, without erasing B1.
MULA1; ZZ; MULA2; TDEC U6
MULA2; Z;  MULA3; TDEC U9
MULA2; NZ; MULA2; TDEC U6, INC U9
MULA3; Z;  MULA4; TDEC U7
MULA3; NZ; MULA3; TDEC U9, INC U6, INC U7
MULA4; Z;  MULA7; TDEC B1
MULA4; NZ; MULA5; READ B1

#### ! FIXME: broken
# MULA5; Z;  MULA6; READ B3
# MULA5; NZ; MULA6; SET B1, SET B3, NOP

MULA5; Z;  MULA6; READ B3
MULA5; NZ; MULA6_TEMP; SET B1, READ B3
MULA6_TEMP; *;  MULA6; SET B3, NOP

#### ! ENDFIXME:

MULA6; *;  MULA4; INC B1, INC B3, TDEC U7
MULA7; Z;  MULA8; TDEC B3
MULA7; NZ; MULA7; TDEC B1
MULA8; Z;  MULA9; TDEC U1
MULA8; NZ; MULA8; TDEC B3
# Copy U1 to temporary register U8.
MULA9; Z;  MULA10; TDEC U7
MULA9; NZ; MULA9; TDEC U1, INC U7
MULA10; Z;  MULA11; TDEC U8
MULA10; NZ; MULA10; TDEC U7, INC U1, INC U8
# Set B1 = U1 * B3 and U8 = 0.
MULA11; *;  MULA12; TDEC U8
MULA12; Z;  MULB1; TDEC U6
MULA12; NZ; MULA13; TDEC U6
MULA13; Z;  MULA14; TDEC U9
MULA13; NZ; MULA13; TDEC U6, INC U9
MULA14; Z;  MULA15; TDEC U7
MULA14; NZ; MULA14; TDEC U9, INC U6, INC U7
MULA15; Z;  MULA19; TDEC B3
MULA15; NZ; MULA16; READ B3
MULA16; Z;  MULA17; READ B1
MULA16; NZ; MULA17; READ B1, SET B3, ADD A1
MULA17; Z;  MULA18; ADD B0
MULA17; NZ; MULA18; ADD B1
MULA18; Z;  MULA15; TDEC U7, INC B1, INC B3
MULA18; NZ; MULA18; SET B1, NOP
MULA19; Z;  MULA20; TDEC B1
MULA19; NZ; MULA19; TDEC B3
MULA20; Z;  MULA12; TDEC U8
MULA20; NZ; MULA20; TDEC B1
## The MULB states set B3 = B0, B0 = U0 * B0.
# Copy B0 into B3, without erasing B0.
MULB1; Z;  MULB2; TDEC U9
MULB1; NZ; MULB1; TDEC U6, INC U9
MULB2; Z;  MULB3; TDEC U7
MULB2; NZ; MULB2; TDEC U9, INC U6, INC U7
MULB3; Z;  MULB6; TDEC B0
MULB3; NZ; MULB4; READ B3
MULB4; *;  MULB5; READ B0
MULB5; Z;  MULB3; INC B0, INC B3, TDEC U7
MULB5; NZ; MULB5; SET B0, SET B3, NOP
MULB6; Z;  MULB7; TDEC B3
MULB6; NZ; MULB6; TDEC B0
MULB7; Z;  MULB8; TDEC U0
MULB7; NZ; MULB7; TDEC B3
# Copy U0 to temporary register U8.
MULB8; Z;  MULB9; TDEC U7
MULB8; NZ; MULB8; TDEC U0, INC U7
MULB9; Z;  MULB10; TDEC U8
MULB9; NZ; MULB9; TDEC U7, INC U0, INC U8
`;

const part2 = `
# Set B0 = U0 * B3 and U8 = 0.
MULB10; *;  MULB11; TDEC U8
MULB11; Z;  MULC1; TDEC U1
MULB11; NZ; MULB12; TDEC U6
MULB12; Z;  MULB13; TDEC U9
MULB12; NZ; MULB12; TDEC U6, INC U9
MULB13; Z;  MULB14; TDEC U7
MULB13; NZ; MULB13; TDEC U9, INC U6, INC U7
MULB14; Z;  MULB18; TDEC B3
MULB14; NZ; MULB15; READ B3
MULB15; Z;  MULB16; READ B0
MULB15; NZ; MULB16; READ B0, SET B3, ADD A1
MULB16; Z;  MULB17; ADD B0
MULB16; NZ; MULB17; ADD B1
MULB17; Z;  MULB14; TDEC U7, INC B0, INC B3
MULB17; NZ; MULB17; SET B0, NOP
MULB18; Z;  MULB19; TDEC B0
MULB18; NZ; MULB18; TDEC B3
MULB19; Z;  MULB11; TDEC U8
MULB19; NZ; MULB19; TDEC B0
## The MULC states set B1 = B1 + (U1 * B0).
# Copy U1 to temporary register U8.
MULC1; Z;  MULC2; TDEC U7
MULC1; NZ; MULC1; TDEC U1, INC U7
MULC2; Z;  MULC3; TDEC U8
MULC2; NZ; MULC2; TDEC U7, INC U1, INC U8
# Set B1 = B1 + (U1 * B3) and U8 = 0.
MULC3; Z;  MULD1; TDEC U6
MULC3; NZ; MULC4; TDEC U6
MULC4; Z;  MULC5; TDEC U9
MULC4; NZ; MULC4; TDEC U6, INC U9
MULC5; Z;  MULC6; TDEC U7
MULC5; NZ; MULC5; TDEC U9, INC U6, INC U7
MULC6; Z;  MULC10; TDEC B3
MULC6; NZ; MULC7; READ B3
MULC7; Z;  MULC8; READ B1
MULC7; NZ; MULC8; READ B1, SET B3, ADD A1
MULC8; Z;  MULC9; ADD B0
MULC8; NZ; MULC9; ADD B1
MULC9; Z;  MULC6; TDEC U7, INC B1, INC B3
MULC9; NZ; MULC9; SET B1, NOP
MULC10; Z;  MULC11; TDEC B1
MULC10; NZ; MULC10; TDEC B3
MULC11; Z;  MULC3; TDEC U8
MULC11; NZ; MULC11; TDEC B1
## The MULD states set B2 = U1 * B2.
# Copy B2 into B3, without erasing B2.
MULD1; Z;  MULD2; TDEC U9
MULD1; NZ; MULD1; TDEC U6, INC U9
MULD2; Z;  MULD3; TDEC U7
MULD2; NZ; MULD2; TDEC U9, INC U6, INC U7
MULD3; Z;  MULD6; TDEC B2
MULD3; NZ; MULD4; READ B3
MULD4; *;  MULD5; READ B2
MULD5; Z;  MULD3; INC B2, INC B3, TDEC U7
MULD5; NZ; MULD5; SET B2, SET B3, NOP
MULD6; Z;  MULD7; TDEC B3
MULD6; NZ; MULD6; TDEC B2
MULD7; Z;  MULD8; TDEC U1
MULD7; NZ; MULD7; TDEC B3
# Copy U1 to temporary register U8.
MULD8; Z;  MULD9; TDEC U7
MULD8; NZ; MULD8; TDEC U1, INC U7
MULD9; Z;  MULD10; TDEC U8
MULD9; NZ; MULD9; TDEC U7, INC U1, INC U8
# Set B2 = U1 * B3 and U8 = 0.
MULD10; *;  MULD11; TDEC U8
MULD11; Z;  ITER8; INC U4, NOP
MULD11; NZ; MULD12; TDEC U6
MULD12; Z;  MULD13; TDEC U9
MULD12; NZ; MULD12; TDEC U6, INC U9
MULD13; Z;  MULD14; TDEC U7
MULD13; NZ; MULD13; TDEC U9, INC U6, INC U7
MULD14; Z;  MULD18; TDEC B3
MULD14; NZ; MULD15; READ B3
MULD15; Z;  MULD16; READ B2
MULD15; NZ; MULD16; READ B2, SET B3, ADD A1
MULD16; Z;  MULD17; ADD B0
MULD16; NZ; MULD17; ADD B1
MULD17; Z;  MULD14; INC B2, INC B3, TDEC U7
MULD17; NZ; MULD17; SET B2, NOP
MULD18; Z;  MULD19; TDEC B2
MULD18; NZ; MULD18; TDEC B3
MULD19; Z;  MULD11; TDEC U8
MULD19; NZ; MULD19; TDEC B2
`;

const part3 = `
# Increase the amount of memory that we are allocating to the
# binary registers, by adding U4 to U6.
ITER8; ZZ; ITER9; TDEC U4
ITER9; Z;  ITER10; TDEC U7
ITER9; NZ; ITER9; TDEC U4, INC U7
ITER10; Z;  ITER6; TDEC U5
ITER10; NZ; ITER10; TDEC U7, INC U4, INC U6
## Extract the units digit from (10^U3) * B1 / B2, as that is
## the digit of pi that we want to print.
# Copy U3 to temporary register U8.
ITER11; Z;  ITER12; TDEC U7
ITER11; NZ; ITER11; TDEC U3, INC U7
ITER12; Z;  ITER13; TDEC U6
ITER12; NZ; ITER12; TDEC U7, INC U3, INC U8
# Copy B1 into B3, without erasing B1.
ITER13; Z;  ITER14; TDEC U7
ITER13; NZ; ITER13; TDEC U6, INC U7
ITER14; Z;  ITER15; TDEC U9
ITER14; NZ; ITER14; TDEC U7, INC U6, INC U9
ITER15; Z;  ITER18; TDEC B3
ITER15; NZ; ITER16; READ B3
ITER16; *;  ITER17; READ B1
ITER17; Z;  ITER15; INC B1, INC B3, TDEC U9
ITER17; NZ; ITER17; SET B1, SET B3, NOP
ITER18; Z;  ITER19; TDEC B1
ITER18; NZ; ITER18; TDEC B3
ITER19; Z;  CMP1; TDEC U6
ITER19; NZ; ITER19; TDEC B1
# Now compare B2 with B3 to see which is bigger. This
# determines which of the two upcoming code blocks to go to.
CMP1; Z;  CMP2; TDEC U7
CMP1; NZ; CMP1; TDEC U6, INC U7
CMP2; Z;  CMP3; TDEC U9
CMP2; NZ; CMP2; TDEC U7, INC U6, INC U9
CMP3; Z;  CMP4; READ B3
CMP3; NZ; CMP3; TDEC U9, INC B2, INC B3
CMP4; Z;  CMP5; READ B2
CMP4; NZ; CMP8; READ B2, SET B3
CMP5; Z;  CMP6; TDEC B2
CMP5; NZ; CMP10; TDEC B3, SET B2
CMP6; *;  CMP7; TDEC B3
CMP7; Z;  CMP13; TDEC B2
CMP7; NZ; CMP4; READ B3
CMP8; Z;  CMP12; TDEC B3
CMP8; NZ; CMP9; SET B2, NOP
CMP9; ZZ; CMP6; TDEC B2
CMP10; Z;  CMP11; TDEC B2
CMP10; NZ; CMP10; TDEC B3
CMP11; Z;  DIG1; TDEC U8
CMP11; NZ; CMP11; TDEC B2
CMP12; Z;  CMP13; TDEC B2
CMP12; NZ; CMP12; TDEC B3
CMP13; Z;  SUB1; TDEC U6
CMP13; NZ; CMP13; TDEC B2
# If B2 <= B3 then subtract B2 from B3.
# That is, start or carry on with the integer division B3 / B2.
SUB1; Z;  SUB2; TDEC U7
SUB1; NZ; SUB1; TDEC U6, INC U7
SUB2; Z;  SUB3; TDEC U9
SUB2; NZ; SUB2; TDEC U7, INC U6, INC U9
SUB3; Z;  SUB7; TDEC B3
SUB3; NZ; SUB4; READ B3
SUB4; Z;  SUB5; READ B2
SUB4; NZ; SUB5; READ B2, SUB A1
SUB5; Z;  SUB6; SUB B0
SUB5; NZ; SUB6; SUB B1, SET B2
SUB6; Z;  SUB3; INC B2, INC B3, TDEC U9
SUB6; NZ; SUB6; SET B3, NOP
SUB7; Z;  SUB8; TDEC B2
SUB7; NZ; SUB7; TDEC B3
SUB8; Z;  CMP1; TDEC U6, INC U2
SUB8; NZ; SUB8; TDEC B2
# If B2 > B3 we cannot subtract anymore.
# Multiply B3 by 10 and reset U2, or jump ahead and print
# the digit that we have now computed.
DIG1; Z;  OUT0; TDEC U2
DIG1; NZ; DIG2; TDEC U2
DIG2; Z;  DIG3; TDEC U6
DIG2; NZ; DIG2; TDEC U2
DIG3; Z;  DIG4; TDEC U7
DIG3; NZ; DIG3; TDEC U6, INC U7
DIG4; Z;  DIG5; TDEC U9
DIG4; NZ; DIG4; TDEC U7, INC U6, INC U9
DIG5; Z;  DIG8; TDEC B3
DIG5; NZ; DIG6; READ B3
DIG6; Z;  DIG7; MUL 0
DIG6; NZ; DIG7; MUL 1
DIG7; Z;  DIG5; INC B3, TDEC U9
DIG7; NZ; DIG7; SET B3, NOP
DIG8; Z;  CMP1; TDEC U6
DIG8; NZ; DIG8; TDEC B3
`;

const part4 = `
# Print the current digit, which is stored in U2.
OUT0; Z;  OUTD1; NOP, OUTPUT 0
OUT0; NZ; OUT1; TDEC U2
OUT1; Z;  OUTD1; NOP, OUTPUT 1
OUT1; NZ; OUT2; TDEC U2
OUT2; Z;  OUTD1; NOP, OUTPUT 2
OUT2; NZ; OUT3; TDEC U2
OUT3; Z;  OUTD1; NOP, OUTPUT 3
OUT3; NZ; OUT4; TDEC U2
OUT4; Z;  OUTD1; NOP, OUTPUT 4
OUT4; NZ; OUT5; TDEC U2
OUT5; Z;  OUTD1; NOP, OUTPUT 5
OUT5; NZ; OUT6; TDEC U2
OUT6; Z;  OUTD1; NOP, OUTPUT 6
OUT6; NZ; OUT7; TDEC U2
OUT7; Z;  OUTD1; NOP, OUTPUT 7
OUT7; NZ; OUT8; TDEC U2
OUT8; Z;  OUTD1; NOP, OUTPUT 8
OUT8; NZ; OUTD1; NOP, OUTPUT 9
# Check whether or not we just printed the very first digit (3).
# If so, print a decimal point. Either way, increase U3, which
# counts which decimal place we are currently at, and loop back
# to start the next digit calculation.
OUTD1; ZZ; OUTD2; TDEC U3
OUTD2; Z;  ITER1; INC U3, NOP, OUTPUT .
OUTD2; NZ; OUTD3; INC U3, NOP
OUTD3; ZZ; ITER1; INC U3, NOP
`;

export const piCalculator = [part1, part2, part3, part4].join("");
