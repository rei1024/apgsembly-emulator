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

export class FunctionCallStatement extends APGCStatement {
    /**
     * 
     * @param {string} funcName 
     * @param {APGCExpression[]} args 
     */
    constructor(funcName, args) {
        super();
        this.funcName = funcName;
        this.args = args;
    }
}

export class IfZeroTDECUStatement extends APGCStatement {
    /**
     * 
     * @param {NumberExpression} reg
     * @param {APGCStatements} z 
     * @param {APGCStatements} nz 
     */
    constructor(reg, z, nz) {
        super();
        this.reg = reg;
        this.z = z;
        this.nz = nz;
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
