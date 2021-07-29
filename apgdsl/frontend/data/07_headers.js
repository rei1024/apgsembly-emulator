headers = [
    '#COMPONENTS U0',
    '#REGISTERS { "U0": 3 }'
]

main = [
    while_non_zero(tdec_u(0), [
        output('1') // if U0 is not zero
    ]),
]
