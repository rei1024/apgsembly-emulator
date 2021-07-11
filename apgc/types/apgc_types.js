// @ts-check

/**
 * @abstract
 */
 export class APGCStatement {

}

export class APGCStatements {
    /**
     * 
     * @param {APGCStatement[]} statements 
     */
    constructor(statements) {
        this.statements = statements;
    }
}

/**
 * @abstract
 */
export class APGCExpression {

}

/// 42
export class NumberExpression extends APGCExpression {
    /**
     * 
     * @param {number} value 
     */
    constructor(value) {
        super();
        this.value = value;
    }
}

/// "abc"
export class StringExpression extends APGCExpression {
    /**
     * 
     * @param {string} str 
     */
    constructor(str) {
        super();
        this.string = str;
    }
}

/// f(1, 2, 3)
export class FunctionCallExpression extends APGCExpression {
    /**
     * 
     * @param {string} name 
     * @param {APGCExpression[]} args 
     */
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
}

// expression with ;
export class APGCExpressionStatement extends APGCStatement {
    /**
     * 
     * @param {APGCExpression} expr 
     */
    constructor(expr) {
        super();
        this.expr = expr;
    }
}

export class IfZeroStatement extends APGCStatement {
    /**
     * 
     * @param {APGCExpression} expr 
     * @param {APGCStatements} zeroStatements 
     * @param {APGCStatements} nonZeroStatements 
     */
    constructor(expr, zeroStatements, nonZeroStatements) {
        super();
        this.expr = expr;
        this.zeroStatements = zeroStatements;
        this.nonZeroStataments = nonZeroStatements;
    }
}

/**
 * while_non_zero (expr) { statements } 
 */
export class WhileNonZeroStatement extends APGCStatement {
    /**
     * 
     * @param {APGCExpression} expr 
     * @param {APGCStatements} statements 
     */
    constructor(expr, statements) {
        super();
        this.expr = expr;
        this.statements = statements;
    }
}

export class APGCProgram {
    /**
     * 
     * @param {APGCStatements} apgcStatements 
     */
    constructor(apgcStatements) {
        this.apgcStatements = apgcStatements;
    }
}
