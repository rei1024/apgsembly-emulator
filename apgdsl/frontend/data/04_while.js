main = [
    inc_u(0),
    inc_u(0),
    inc_u(0),
    while_non_zero(tdec_u(0), [
        output('1') // if U0 is not zero
    ]),
    while_zero(nop(), [
        output('0'),
        halt_out()
    ])
]
