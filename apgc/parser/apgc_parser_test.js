import { APGCProgram, APGCStatements, FunctionCallStatement, IfZeroTDECUStatement, NumberExpression, StringExpression } from "../types/apgc_types.js";
import { apgcProgramParser, functionCallStatementParser, identifierParser, numberExpressionParser, stringExpressionParser } from "./apgc_parser.js";

import { assertEquals } from "../../test/deps.js";

/**
 * 
 * @param {string} name 
 * @param {() => void} fn 
 */
function test(name, fn) {
    Deno.test(name, fn);
}

test('numberExpressionParser', () => {
    assertEquals(numberExpressionParser.parseValue("123"), new NumberExpression(123));
    assertEquals(numberExpressionParser.parseValue("abc"), undefined);
});

test('identifierParser', () => {
    assertEquals(identifierParser.parseValue('a0'), "a0");
    assertEquals(identifierParser.parseValue('0a'), undefined);
    assertEquals(identifierParser.parseValue(''), undefined);

    assertEquals(identifierParser.parseValue('Abc0'), "Abc0");
});

test('functionCallStatement output(1)', () => {
    const str = "output(1)";
    assertEquals(functionCallStatementParser().parseValue(str), new FunctionCallStatement('output', [new NumberExpression(1)]));
});

test('functionCallStatement output(1,2)', () => {
    const str = "output(1,2)";
    assertEquals(functionCallStatementParser().parseValue(str), new FunctionCallStatement('output', [new NumberExpression(1), new NumberExpression(2)]));
});

test('functionCallStatement output()', () => {
    const str = 'output()';
    assertEquals(functionCallStatementParser().parseValue(str), new FunctionCallStatement('output', []));
});

test('functionCallStatement output("1")', () => {
    const str = 'output("1")';
    assertEquals(functionCallStatementParser().parseValue(str), new FunctionCallStatement('output', [new StringExpression("1")]));
});

test('functionCallStatement output(1, "a", "bb", 3, 4 , 5 )', () => {
    const str = 'output(1, "a", "bb", 3, 4 , 5 )';
    assertEquals(
        functionCallStatementParser().parseValue(str),
        new FunctionCallStatement('output', [
            new NumberExpression(1),
            new StringExpression('a'),
            new StringExpression('bb'),
            new NumberExpression(3),
            new NumberExpression(4),
            new NumberExpression(5)
        ])
    );
});

test('stringExpression', () => {
    assertEquals(stringExpressionParser.parseValue(`"abc"`), new StringExpression('abc'));

    assertEquals(stringExpressionParser.parseValue(`""`), new StringExpression(''));
    assertEquals(stringExpressionParser.parseValue(``), undefined);
    assertEquals(stringExpressionParser.parseValue(`"`), undefined);
    assertEquals(stringExpressionParser.parseValue(`abc`), undefined);

    assertEquals(stringExpressionParser.parseValue(`"\\""`), new StringExpression('"'));
    assertEquals(stringExpressionParser.parseValue(`"abc\\"def"`), new StringExpression('abc"def'));

    assertEquals(stringExpressionParser.parse(`"abc"def`), { rest: "def", value: new StringExpression('abc') });
    
});

test('apgcProgramParser', () => {
    const str = `
output(1);
output(2, 3);    
`
    assertEquals(apgcProgramParser().parseValue(str), new APGCProgram(
        new APGCStatements(
            [
                new FunctionCallStatement(
                    'output',
                    [
                        new NumberExpression(1)
                    ]
                ),
                new FunctionCallStatement(
                    'output',
                    [
                        new NumberExpression(2),
                        new NumberExpression(3),
                    ]
                )
            ]
        )
    ))
});

test('apgcProgramParser if_zero_tdec_u', () => {
    const str = `
if_zero_tdec_u(0) {
    output(1);
} else {
    output(2);  
}
`
    assertEquals(apgcProgramParser().parseValue(str), new APGCProgram(
        new APGCStatements(
            [
                new IfZeroTDECUStatement(
                    new NumberExpression(0),
                    new APGCStatements(
                        [
                            new FunctionCallStatement('output', [new NumberExpression(1)])
                        ]
                    ),
                    new APGCStatements(
                        [
                            new FunctionCallStatement('output', [new NumberExpression(2)])
                        ]
                    )
                )
            ]
        )
    ))
});

test('apgcProgramParser if_zero_tdec_u else empty', () => {
    const str = `
if_zero_tdec_u(0) {
    output(1);
}
`
    assertEquals(apgcProgramParser().parseValue(str), new APGCProgram(
        new APGCStatements(
            [
                new IfZeroTDECUStatement(
                    new NumberExpression(0),
                    new APGCStatements(
                        [
                            new FunctionCallStatement('output', [new NumberExpression(1)])
                        ]
                    ),
                    new APGCStatements([])
                )
            ]
        )
    ))
});
