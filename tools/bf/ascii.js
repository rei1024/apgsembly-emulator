// @ts-check

// /* U8 = 8 */
// macro const_8_U!() 8

// /* B3 */
// macro FONT_DATA!() 3

// macro print_char!(code_b, temp_u1, temp_u2, temp_u3) {
//     /* TODO newline */

//     /* Move font data head */
//     copy_u!(const_8_U!(), temp_u3, temp_u1);

//     inc_u(temp_u1);
//     while_nz (tdec_u(temp_u3)) {
//         if_z (read_b(code_b)) {
//             while_nz (tdec_u(temp_u1)) {
//                 inc_u(temp_u2);
//             }
//         } else {
//             set_b(code_b);
//             while_nz (tdec_u(temp_u1)) {
//                 repeat(64, inc_b(FONT_DATA!()));
//                 inc_u(temp_u2);
//             }
//         }

//         inc_b(code_b);

//         while_nz (tdec_u(temp_u2)) {
//             repeat(2, inc_u(temp_u1));
//         }
//     }

//     u_to_0!(temp_u1);

//     copy_u!(const_8_U!(), temp_u3, temp_u1);

//     while_nz (tdec_u(temp_u3)) {
//         /* Restore */
//         tdec_b(code_b);
//     }

//     /* Print to B2D */

//     copy_u!(const_8_U!(), temp_u1, temp_u2);

//     while_nz (tdec_u(temp_u1)) {
//         copy_u!(const_8_U!(), temp_u2, temp_u3);
//         while_nz (tdec_u(temp_u2)) {
//             if_z (read_b(FONT_DATA!())) {
//             } else {
//                 set_b(FONT_DATA!());
//                 set_b2d();
//             }

//             inc_b(FONT_DATA!());

//             inc_b2dy();
//         }

//         copy_u!(const_8_U!(), temp_u2, temp_u3);
//         while_nz (tdec_u(temp_u2)) {
//             tdec_b2dy();
//         }
//         inc_b2dx();
//     }

//     b_head_to_0!(FONT_DATA!());

//     /* Go to next Character */
//     copy_u!(const_8_U!(), temp_u2, temp_u3);
//     while_nz (tdec_u(temp_u2)) {
//         inc_b2dy();
//     }

//     copy_u!(const_8_U!(), temp_u2, temp_u3);
//     while_nz (tdec_u(temp_u2)) {
//         tdec_b2dx();
//     }
// }

// macro newline!(temp_u1, temp_u2) {
//     set_b2dy_0!();
//     copy_u!(const_8_U!(), temp_u1, temp_u2);
//     while_nz (tdec_u(temp_u1)) {
//         inc_b2dx();
//     }
// }

/**
 * @param {string} targetB
 * @param {string} startState
 * @param {string} goalState
 * @param {string} tempU1
 * @param {string} tempU2
 * @param {string} tempU3
 * @returns {string[]}
 */
export function printAscii(
  targetB,
  startState,
  goalState,
  tempU1,
  tempU2,
  tempU3,
) {
  /**
   * @type {string[]}
   */
  const lines = [];
  /**
   * @param {string} line
   */
  function pushLine(line) {
    lines.push(line);
  }

  // newline 0b00001010
  pushLine(`OP_OUTPUT; *; OP_OUTPUT_NEWLINE_CHECK_0; NOP`);

  // TODO

  // newline
  pushLine(`OP_OUTPUT_NEWLINE; *; TODO`);

  // print char
  pushLine(`OP_OUTPUT_PRINT; *; TODO`);

  return lines;
}
