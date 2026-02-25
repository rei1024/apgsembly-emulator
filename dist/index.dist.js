var u = () => {
        throw Error("internal error");
};
var On = () => {
        let e = [];
        for (let r = 0; r <= 6; r++) {
                for (let n of [1, ...r === 0 ? [] : [1.5], 2, 3, 5, 8]) {
                        e.push(n * 10 ** r);
                }
        }
        return e.push(10 * 10 ** 6, 15 * 10 ** 6, 20 * 10 ** 6),
                e.map((r) => Math.floor(r));
};
function Nr(e, t) {
        let r = On();
        e.min = "0", e.max = (r.length - 1).toString();
        function n() {
                let s = parseInt(e.value, 10), i = r[s] ?? u();
                e.ariaValueText = `(${i.toString()}Hz)`, t.setFrequency(i);
        }
        e.addEventListener("input", () => {
                n();
        }),
                setTimeout(() => {
                        n();
                }, 1);
}
var $r = (e, t) => {
                e.setCustomValidity(t),
                        e.reportValidity(),
                        e.classList.add("is-invalid");
        },
        wr = (e) => {
                e.setCustomValidity(""),
                        e.reportValidity(),
                        e.classList.remove("is-invalid");
        };
function _r(e, t) {
        e.addEventListener("input", () => {
                let r = e.files?.item(0);
                r?.text().then(t);
        });
}
var Qt = window.requestIdleCallback ?? ((e) => {
        setTimeout(() => {
                e({
                        didTimeout: !1,
                        timeRemaining() {
                                return 0;
                        },
                });
        }, 0);
});
var xt = (e, t) => {
                try {
                        localStorage.setItem(e, t);
                } catch {}
        },
        Jt = (e) => {
                try {
                        localStorage.removeItem(e);
                } catch {}
        },
        yt = (e) => {
                try {
                        return localStorage.getItem(e);
                } catch {
                        return null;
                }
        };
function bt(e, t) {
        try {
                let r = yt(e);
                r != null && (Jt(e), xt(t, r));
        } catch {}
}
var Pn = new Set([
                "textarea",
                "input",
                "summary",
                "details",
                "button",
                "audio",
                "video",
                "select",
                "option",
                "a",
                "area",
                "modal",
        ]),
        Tr = () => {
                let e = document.activeElement?.tagName.toLowerCase() ?? "";
                return Pn.has(e);
        };
var p = (e, t) => {
        let r = document.querySelector(e);
        if (r == null) throw Error(`can't found a element for "${e}"`);
        if (r instanceof t) return r;
        throw Error(`"${e}" is not a ${t.name}`);
};
var g = HTMLElement,
        U = HTMLInputElement,
        P = HTMLButtonElement,
        Ir = p("#error", g),
        z = p("#input", HTMLTextAreaElement),
        Br = p("#output_detail", g),
        Dr = p("#output", HTMLTextAreaElement),
        Rr = p("#steps", g),
        A = p("#toggle", P),
        H = p("#reset", P),
        v = p("#step", P),
        te = p("#step-text", g),
        Ar = p("#config_button", P),
        St = p("#stats_button", P),
        vr = p("#current_state", g),
        Cr = p("#previous_output", g),
        Lr = p("#frequency_input", U),
        Mr = p("#frequency_output", g),
        kr = p("#command", g),
        Hn = p("#canvas", HTMLCanvasElement),
        Ie = Hn.getContext("2d") ?? (() => {
                throw Error("context is null");
        })(),
        ee = HTMLDetailsElement,
        Tt = { x: p("#b2dx", g), y: p("#b2dy", g) },
        Et = p("#b2d_detail", ee),
        Fn = p("#printer_canvas", HTMLCanvasElement),
        Be = Fn.getContext("2d") ?? (() => {
                throw Error("context is null");
        })(),
        It = { x: p("#printer_x", g), y: p("#printer_y", g) },
        Nt = p("#printer_detail", ee),
        Ur = p("#unary_register", g),
        Bt = p("#unary_register_detail", ee),
        zr = p("#binary_register", g),
        Dt = p("#binary_register_detail", ee),
        Or = p("#add_sub_mul_detail", g),
        Pr = p("#add_sub_mul", g),
        Hr = p("#import_file", U),
        re = p("#examples", P),
        Fr = document.querySelectorAll(".js_example"),
        De = p("#config_modal_content", g),
        Rt = p("#step_input", U),
        w = {
                $hideBits: p("#hide_bits", U),
                $reverseBits: p("#reverse_bits", U),
                $showBinaryValueInDecimal: p(
                        "#show_binary_value_in_decimal",
                        U,
                ),
                $showBinaryValueInHex: p("#show_binary_value_in_hex", U),
        },
        Re = p("#breakpoint_select", HTMLSelectElement),
        Gr = p("#breakpoint_input_select", HTMLSelectElement),
        At = p("#dark_mode", U),
        Ae = p("#dark_mode_label", g),
        vt = p("#b2d_hide_pointer", U),
        $t = p("#b2d_flip_upside_down", U),
        ne = p("#stats_modal", g),
        Vr = p("#stats_body", g),
        Yr = p("#stats_number_of_states", g),
        Zr = p("#view-state-diagram", P),
        Wr = p("#add-library-file", P),
        Xr = p("#library-list", g),
        ve = p('#library_modal [data-bs-dismiss="modal"]', g),
        se = p("#add-binary-library-file", P);
var x = class {
        pretty() {
                return "";
        }
        doesReturnValue() {
                return !1;
        }
        isSameComponent(t) {
                return !0;
        }
};
var Ce = "A1",
        Le = "B0",
        Me = "B1",
        jr = "ADD",
        Gn = (e) => {
                switch (e) {
                        case 0:
                                return Ce;
                        case 1:
                                return Le;
                        case 2:
                                return Me;
                }
        },
        Vn = (e) => {
                switch (e) {
                        case Ce:
                                return 0;
                        case Le:
                                return 1;
                        case Me:
                                return 2;
                }
        },
        I = class e extends x {
                constructor(t) {
                        super(), this.op = t;
                }
                pretty() {
                        return `${jr} ${Gn(this.op)}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (n === jr && (s === Ce || s === Le || s === Me)) {
                                return new e(Vn(s));
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !1;
                                case 1:
                                        return !0;
                                case 2:
                                        return !0;
                        }
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var Ct = "INC",
        ie = "TDEC",
        oe = "READ",
        ae = "SET",
        Ue = "B2DX",
        ze = "B2DY",
        Oe = "B2D",
        Zn = "DEC",
        qr = "SQX",
        Kr = "SQY",
        Qr = "SQ",
        ke = (e) => {
                switch (e) {
                        case Ct:
                                return 0;
                        case ie:
                                return 1;
                        case oe:
                                return 2;
                        case ae:
                                return 3;
                }
        },
        Jr = (e) => {
                switch (e) {
                        case 0:
                                return Ct;
                        case 1:
                                return ie;
                        case 2:
                                return oe;
                        case 3:
                                return ae;
                }
        },
        tn = (e) => {
                switch (e) {
                        case Ue:
                                return 4;
                        case ze:
                                return 5;
                        case Oe:
                                return 6;
                }
        },
        Wn = (e) => {
                switch (e) {
                        case 4:
                                return Ue;
                        case 5:
                                return ze;
                        case 6:
                                return Oe;
                }
        },
        X = class e extends x {
                constructor(t, r, n = 0) {
                        super(), this.op = t, this.axis = r, this.kind = n;
                }
                pretty() {
                        let t = this.op;
                        if (this.kind === 1) {
                                if (t === 2) {
                                        throw new Error(
                                                "PRINTER component cannot READ",
                                        );
                                }
                                return t === 3 && this.axis === 6
                                        ? "PRINT"
                                        : `${Jr(t)} PRN${
                                                this.axis === 4 ? "X" : "Y"
                                        }`;
                        }
                        return `${Jr(t)} ${Wn(this.axis)}`;
                }
                static parse(t) {
                        let r = t.trim().split(" "), n = r.length;
                        if (r.length === 1 && r[0] === "PRINT") {
                                return new e(3, 6, 1);
                        }
                        if (n === 2) {
                                let [o, a] = r;
                                if (
                                        (o === Ct || o === ie) &&
                                        (a === "PRNX" || a === "PRNY")
                                ) {
                                        let c = a === "PRNX" ? 4 : 5;
                                        return new e(ke(o), c, 1);
                                }
                        }
                        if (n !== 2) return;
                        let [s, i] = r;
                        if (!(s === void 0 || i === void 0)) {
                                if (s === Ct || s === ie) {
                                        if (i === Ue || i === ze) {
                                                return new e(ke(s), tn(i));
                                        }
                                } else if ((s === oe || s === ae) && i === Oe) {
                                        return new e(ke(s), tn(i));
                                }
                                switch (s) {
                                        case Ct:
                                                switch (i) {
                                                        case qr:
                                                                return new e(
                                                                        0,
                                                                        4,
                                                                );
                                                        case Kr:
                                                                return new e(
                                                                        0,
                                                                        5,
                                                                );
                                                        default:
                                                                return;
                                                }
                                        case Zn:
                                                switch (i) {
                                                        case qr:
                                                                return new e(
                                                                        1,
                                                                        4,
                                                                );
                                                        case Kr:
                                                                return new e(
                                                                        1,
                                                                        5,
                                                                );
                                                        default:
                                                                return;
                                                }
                                        case oe:
                                                return i === Qr
                                                        ? new e(2, 6)
                                                        : void 0;
                                        case ae:
                                                return i === Qr
                                                        ? new e(3, 6)
                                                        : void 0;
                                }
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !1;
                                case 1:
                                        return !0;
                                case 2:
                                        return !0;
                                case 3:
                                        return !1;
                        }
                }
                isSameComponent(t) {
                        if (t instanceof e) {
                                if (t.kind !== this.kind) return !1;
                                let r = this.axis, n = t.axis;
                                return r === 4 && n === 5
                                        ? !1
                                        : !(r === 5 && n === 4);
                        }
                        return !1;
                }
        };
var Pe = "INC",
        He = "TDEC",
        Fe = "READ",
        Ge = "SET",
        en = "B",
        Xn = (e) => {
                switch (e) {
                        case 0:
                                return Pe;
                        case 1:
                                return He;
                        case 2:
                                return Fe;
                        case 3:
                                return Ge;
                }
        },
        jn = (e) => {
                switch (e) {
                        case Pe:
                                return 0;
                        case He:
                                return 1;
                        case Fe:
                                return 2;
                        case Ge:
                                return 3;
                }
        },
        b = class e extends x {
                constructor(t, r) {
                        super(),
                                this.op = t,
                                this.regNumber = r,
                                this.registerCache = void 0;
                }
                pretty() {
                        return `${Xn(this.op)} ${en}${this.regNumber}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (
                                !(n === void 0 || s === void 0) &&
                                (n === Pe || n === He || n === Fe ||
                                        n === Ge) &&
                                s.startsWith(en)
                        ) {
                                let i = s.slice(1);
                                if (/^[0-9]+$/u.test(i)) {
                                        return new e(jn(n), parseInt(i, 10));
                                }
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !1;
                                case 1:
                                        return !0;
                                case 2:
                                        return !0;
                                case 3:
                                        return !1;
                        }
                }
                isSameComponent(t) {
                        return t instanceof e
                                ? this.regNumber === t.regNumber
                                : !1;
                }
        };
var rn = "HALT_OUT",
        nn = "HALT",
        N = class e extends x {
                constructor(t = !0) {
                        super(), this.output = t;
                }
                pretty() {
                        return this.output ? rn : nn;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 1) return;
                        let [n] = r;
                        if (n === rn) return new e(!0);
                        if (n === nn) return new e(!1);
                }
                doesReturnValue() {
                        return !1;
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var Ve = "0",
        Ye = "1",
        sn = "MUL",
        qn = (e) => {
                switch (e) {
                        case Ve:
                                return 0;
                        case Ye:
                                return 1;
                }
        },
        Kn = (e) => {
                switch (e) {
                        case 0:
                                return Ve;
                        case 1:
                                return Ye;
                }
        },
        j = class e extends x {
                constructor(t) {
                        super(), this.op = t;
                }
                pretty() {
                        return `${sn} ${Kn(this.op)}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (n === sn && (s === Ve || s === Ye)) {
                                return new e(qn(s));
                        }
                }
                doesReturnValue() {
                        return !0;
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var on = "NOP",
        q = class e extends x {
                constructor() {
                        super();
                }
                pretty() {
                        return on;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 1) return;
                        let [n] = r;
                        if (n === on) return new e();
                }
                doesReturnValue() {
                        return !0;
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var an = "OUTPUT",
        K = class e extends x {
                constructor(t) {
                        super(), this.digit = t;
                }
                pretty() {
                        return `${an} ${this.digit}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (n === an && s !== void 0) return new e(s);
                }
                doesReturnValue() {
                        return !1;
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var Ze = "A1",
        We = "B0",
        Xe = "B1",
        cn = "SUB",
        Qn = (e) => {
                switch (e) {
                        case 0:
                                return Ze;
                        case 1:
                                return We;
                        case 2:
                                return Xe;
                }
        },
        Jn = (e) => {
                switch (e) {
                        case Ze:
                                return 0;
                        case We:
                                return 1;
                        case Xe:
                                return 2;
                }
        },
        Q = class e extends x {
                constructor(t) {
                        super(), this.op = t;
                }
                pretty() {
                        return `${cn} ${Qn(this.op)}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (n === cn && (s === Ze || s === We || s === Xe)) {
                                return new e(Jn(s));
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !1;
                                case 1:
                                        return !0;
                                case 2:
                                        return !0;
                        }
                }
                isSameComponent(t) {
                        return t instanceof e;
                }
        };
var je = "INC",
        qe = "TDEC",
        un = "U",
        ts = "R",
        es = (e) => {
                switch (e) {
                        case 0:
                                return je;
                        case 1:
                                return qe;
                }
        },
        rs = (e) => {
                switch (e) {
                        case je:
                                return 0;
                        case qe:
                                return 1;
                }
        },
        E = class e extends x {
                constructor(t, r) {
                        super(),
                                this.op = t,
                                this.regNumber = r,
                                this.registerCache = void 0;
                }
                pretty() {
                        return `${es(this.op)} ${un}${this.regNumber}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (
                                !(n === void 0 || s === void 0) &&
                                (n === je || n === qe) &&
                                (s.startsWith(un) || s.startsWith(ts))
                        ) {
                                let i = s.slice(1);
                                if (/^[0-9]+$/u.test(i)) {
                                        return new e(rs(n), parseInt(i, 10));
                                }
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !1;
                                case 1:
                                        return !0;
                        }
                }
                isSameComponent(t) {
                        return t instanceof e
                                ? this.regNumber === t.regNumber
                                : !1;
                }
        };
var Ke = "INC",
        Qe = "DEC",
        Je = "READ",
        tr = "SET",
        er = "RESET",
        ns = (e) => {
                switch (e) {
                        case 0:
                                return Ke;
                        case 1:
                                return Qe;
                        case 2:
                                return Je;
                        case 3:
                                return tr;
                        case 4:
                                return er;
                }
        },
        ss = (e) => {
                switch (e) {
                        case Ke:
                                return 0;
                        case Qe:
                                return 1;
                        case Je:
                                return 2;
                        case tr:
                                return 3;
                        case er:
                                return 4;
                }
        },
        J = class e extends x {
                constructor(t, r) {
                        super(), this.op = t, this.regNumber = r;
                }
                pretty() {
                        return `${ns(this.op)} T${this.regNumber}`;
                }
                static parse(t) {
                        let r = t.trim().split(" ");
                        if (r.length !== 2) return;
                        let [n, s] = r;
                        if (
                                !(n === void 0 || s === void 0) &&
                                (n === Ke || n === Qe || n === Je || n === tr ||
                                        n === er) &&
                                s.startsWith("T")
                        ) {
                                let i = s.slice(1);
                                if (/^[0-9]+$/u.test(i)) {
                                        return new e(ss(n), parseInt(i, 10));
                                }
                        }
                }
                doesReturnValue() {
                        switch (this.op) {
                                case 0:
                                        return !0;
                                case 1:
                                        return !0;
                                case 2:
                                        return !0;
                                case 3:
                                        return !1;
                                case 4:
                                        return !1;
                        }
                }
                isSameComponent(t) {
                        return t instanceof e
                                ? this.regNumber === t.regNumber
                                : !1;
                }
        };
var le = class {
        constructor() {
                this.value = 0;
        }
        action(t) {
                switch (t.op) {
                        case 1: {
                                let r = this.value, n = r % 2;
                                return this.value = r >>> 1, n;
                        }
                        case 2: {
                                let r = this.value, n = 1 - r % 2;
                                return this.value = r === 1 || r === 2 ? 1 : 0,
                                        n;
                        }
                        case 0: {
                                this.value = (this.value + 1) % 4;
                                return;
                        }
                        default:
                                u();
                }
        }
        getValue() {
                return this.value;
        }
        a1() {
                this.action(new I(0));
        }
        b0() {
                let t = this.action(new I(1));
                return t === void 0 && u(), t;
        }
        b1() {
                let t = this.action(new I(2));
                return t === void 0 && u(), t;
        }
        toString() {
                return this.value.toString(2).padStart(2, "0");
        }
        toStringDetail() {
                return this.toString();
        }
};
var rr = (e, t) => Array(e).fill(0).map((r, n) => t(n)),
        Ft = class {
                constructor() {
                        this.x = 0,
                                this.y = 0,
                                this.maxX = 0,
                                this.maxY = 0,
                                this.array = rr(1, () => rr(1, () => 0));
                }
                getArray() {
                        return this.array;
                }
                getMaxX() {
                        return this.maxX;
                }
                getMaxY() {
                        return this.maxY;
                }
                action(t) {
                        switch (t.op) {
                                case 0: {
                                        switch (t.axis) {
                                                case 4:
                                                        return this.incB2DX();
                                                case 5:
                                                        return this.incB2DY();
                                                case 6:
                                                        u();
                                        }
                                        break;
                                }
                                case 1: {
                                        switch (t.axis) {
                                                case 4:
                                                        return this.tdecB2DX();
                                                case 5:
                                                        return this.tdecB2DY();
                                                case 6:
                                                        u();
                                        }
                                        break;
                                }
                                case 2: {
                                        if (t.axis === 6) return this.read();
                                        u();
                                        break;
                                }
                                case 3: {
                                        if (t.axis === 6) return this.set();
                                        u();
                                        break;
                                }
                                default:
                                        u();
                        }
                }
                incB2DX() {
                        let r = this.x + 1;
                        if (this.x = r, this.maxX < r) {
                                for (let n of this.array) n.push(0);
                                this.maxX = r;
                        }
                }
                incB2DY() {
                        let r = this.y + 1;
                        this.y = r,
                                this.maxY < r &&
                                (this.array.push(rr(this.maxX + 1, () =>
                                        0)),
                                        this.maxY = r);
                }
                tdecB2DX() {
                        return this.x === 0 ? 0 : (this.x--, 1);
                }
                tdecB2DY() {
                        return this.y === 0 ? 0 : (this.y--, 1);
                }
                read() {
                        let t = this.array[this.y];
                        t === void 0 && u();
                        let r = this.x, n = t[r];
                        return n === void 0 && u(), t[r] = 0, n;
                }
                set() {
                        let t = this.array[this.y] ?? u(), r = this.x;
                        if (t[r] === 1) {
                                throw Error(
                                        `SET B2D: Tried to set when it was already 1. x = ${r}, y = ${this.y}`,
                                );
                        }
                        t[r] = 1;
                }
        };
var pe = class {
                constructor() {
                        this.value = 0;
                }
                action(t) {
                        switch (t.op) {
                                case 1:
                                        return this.value === 0
                                                ? 0
                                                : (this.value--, 1);
                                case 0: {
                                        this.value++;
                                        return;
                                }
                        }
                }
                actionN(t, r) {
                        switch (t.op) {
                                case 1: {
                                        this.value -= r;
                                        break;
                                }
                                case 0: {
                                        this.value += r;
                                        break;
                                }
                        }
                }
                getValue() {
                        return this.value;
                }
                setValue(t) {
                        this.value = t;
                }
                inc() {
                        this.action(new E(0, 0));
                }
                tdec() {
                        let t = this.action(new E(1, 0));
                        return t === void 0 && u(), t;
                }
                setByRegistersInit(t, r) {
                        (typeof r != "number" || r < 0 ||
                                !Number.isInteger(r)) && tt(t, r),
                                this.setValue(r);
                }
        },
        tt = (e, t) => {
                let r = `"${e}": ${JSON.stringify(t)}`;
                throw Error(`Invalid #REGISTERS ${r}`);
        };
var ln = (e) =>
                [...e].map((t) => {
                        if (t === "0") return 0;
                        if (t === "1") return 1;
                        throw Error(`Invalid #REGISTERS: "${e}"`);
                }),
        is = typeof BigInt < "u",
        nr = (e) => {
                let t = "";
                for (let r = e.length - 1; r >= 0; r--) {
                        t += e[r] === 0
                                ? "0"
                                : "1";
                }
                return t;
        },
        os = (e) => {
                let t = "";
                for (let r = e.length - 1; r >= 0; r--) {
                        t += e[r] === 0
                                ? "0"
                                : "1";
                }
                return t;
        },
        sr = (e) => {
                let t = "", r = e.length;
                for (let n = 0; n < r; n++) t += e[n] === 0 ? "0" : "1";
                return t;
        },
        fe = class {
                constructor() {
                        this.pointer = 0,
                                this.bits = new Uint8Array(1),
                                this.length = 1;
                }
                action(t) {
                        switch (t.op) {
                                case 1:
                                        return this.pointer === 0
                                                ? 0
                                                : (this.pointer--, 1);
                                case 0: {
                                        let r = this.pointer + 1;
                                        this.pointer = r,
                                                r >= this.length &&
                                                this.extend();
                                        return;
                                }
                                case 2: {
                                        let r = this.pointer;
                                        if (r < this.length) {
                                                let n = this.bits,
                                                        s = n[r] ?? u();
                                                return n[r] = 0, s;
                                        } else return 0;
                                }
                                case 3: {
                                        let r = this.pointer;
                                        r >= this.length && this.extend();
                                        let n = this.bits;
                                        if (n[r] === 1) {
                                                throw Error(
                                                        `The bit of the binary register B${t.regNumber} is already 1`,
                                                );
                                        }
                                        n[r] = 1;
                                        return;
                                }
                                default: {
                                        let r = t.op;
                                        return;
                                }
                        }
                }
                actionN(t, r) {
                        switch (t.op) {
                                case 0: {
                                        this.pointer += r,
                                                this.pointer >= this.length &&
                                                this.extend();
                                        break;
                                }
                                case 1: {
                                        this.pointer -= r;
                                        break;
                                }
                                default:
                                        throw Error("todo");
                        }
                }
                getBits() {
                        return Array.from(this.bits.slice(0, this.length));
                }
                getLength() {
                        return this.length;
                }
                setBits(t) {
                        this.length = t.length,
                                this.bits = new Uint8Array(
                                        Math.max(1, t.length),
                                );
                        for (let r = 0; r < t.length; r++) {
                                let n = t[r];
                                n !== void 0 && (this.bits[r] = n);
                        }
                }
                inc() {
                        this.action(new b(0, 0)) !== void 0 && u();
                }
                tdec() {
                        let t = this.action(new b(1, 0));
                        return t === void 0 && u(), t;
                }
                read() {
                        let t = this.action(new b(2, 0));
                        return t === void 0 && u(), t;
                }
                set() {
                        if (this.action(new b(3, 0)) !== void 0) return u();
                }
                extend() {
                        let t = this.pointer, n = this.bits.length;
                        if (t >= n) {
                                let s = n * 2;
                                for (; t >= s;) s *= 2;
                                let i = new Uint8Array(s);
                                i.set(this.bits), this.bits = i;
                        }
                        t >= this.length && (this.length = t + 1);
                }
                toNumberString(t = 10) {
                        return (is ? BigInt : Number)(
                                "0b" + os(this.bits.slice(0, this.length)),
                        ).toString(t);
                }
                toObject() {
                        this.extend();
                        let t = Array.from(this.bits.slice(0, this.length)),
                                r = this.pointer;
                        return {
                                prefix: t.slice(0, r),
                                head: t[r] ?? u(),
                                suffix: t.slice(r + 1),
                        };
                }
                setByRegistersInit(t, r) {
                        if (typeof r == "number") {
                                this.setBits(ln(r.toString(2)).reverse()),
                                        this.extend();
                        } else if (!Array.isArray(r) || r.length !== 2) {
                                tt(t, r);
                        } else {
                                let [n, s] = r;
                                if (
                                        typeof n != "number" ||
                                        typeof s != "string" || n < 0 ||
                                        !Number.isInteger(n)
                                ) tt(t, r);
                                else {
                                        let i = ln(s);
                                        this.pointer = n,
                                                this.setBits(i),
                                                this.extend();
                                }
                        }
                }
        };
var de = class {
        constructor() {
                this.value = 0;
        }
        action(t) {
                switch (t.op) {
                        case 0:
                                return this.mul0();
                        case 1:
                                return this.mul1();
                        default:
                                throw Error("MUL: action");
                }
        }
        getValue() {
                return this.value;
        }
        mul0() {
                let t = this.value, r = t % 2;
                return this.value = t >> 1, r;
        }
        mul1() {
                let t = this.value, r = t % 2;
                return t <= 21
                        ? this.value = (t >> 1) + 5
                        : this.value = t - 22 >> 1,
                        r;
        }
        toString() {
                return this.value.toString(2).padStart(5, "0");
        }
};
var me = class {
        constructor() {}
        action() {
                return 0;
        }
};
var he = class {
        #t = "";
        constructor() {}
        action(t) {
                this.output(t.digit);
        }
        getString() {
                return this.#t;
        }
        output(t) {
                this.#t += t;
        }
};
var ge = class {
        constructor() {
                this.value = 0;
        }
        action(t) {
                switch (t.op) {
                        case 1:
                                return this.b0();
                        case 0:
                                return this.a1();
                        case 2:
                                return this.b1();
                        default:
                                u();
                }
        }
        getValue() {
                return this.value;
        }
        a1() {
                this.value = (this.value + 1) % 4;
        }
        b0() {
                let t = this.value, r = t % 2;
                return this.value = t >= 2 ? 3 : 0, r;
        }
        b1() {
                let t = this.value, r = 1 - t % 2;
                return this.value = t === 0 || t === 3 ? 3 : 0, r;
        }
        toString() {
                return this.value.toString(2).padStart(2, "0");
        }
        toStringDetail() {
                return this.toString();
        }
};
var xe = class {
        constructor() {
                this.pointer = 0, this.bits = [0];
        }
        action(t) {
                switch (t.op) {
                        case 0:
                                return this.inc();
                        case 2:
                                return this.read();
                        case 1:
                                return this.dec();
                        case 3:
                                return this.set();
                        case 4:
                                return this.reset();
                        default:
                                u();
                }
        }
        getPointer() {
                return this.pointer;
        }
        getBits() {
                return this.bits;
        }
        inc() {
                let t = this.bits;
                return this.pointer === t.length - 1
                        ? (t.push(0), this.pointer++, 0)
                        : (this.pointer++, 1);
        }
        dec() {
                return this.pointer === 0 ? 0 : (this.pointer--, 1);
        }
        read() {
                let t = this.pointer, r = this.bits, n = r[t];
                if (n === 0) return r[t] = -1, 0;
                if (n === 1) return r[t] = -1, 1;
                if (n === -1) {
                        throw Error("Error: reading empty space of T register");
                }
                u();
        }
        set() {
                let t = this.pointer;
                if (this.bits[t] === -1) this.bits[t] = 1;
                else throw Error("Error: SET to nonempty bit");
        }
        reset() {
                let t = this.pointer;
                if (this.bits[t] === -1) this.bits[t] = 0;
                else throw Error("Error: RESET to nonempty bit");
        }
};
var Gt = (e, t) => {
                throw Error(`Register ${e}${t} is not found.`);
        },
        pn = Number.parseInt,
        fn = Number.isNaN,
        ye = class {
                constructor({ unary: t, binary: r, legacyT: n }) {
                        this.uRegMap = new Map(t.map((s) => [s, new pe()])),
                                this.bRegMap = new Map(
                                        r.map((s) => [s, new fe()]),
                                ),
                                this.legacyTRegMap = new Map(
                                        n.map((s) => [s, new xe()]),
                                ),
                                this.add = new le(),
                                this.sub = new ge(),
                                this.mul = new de(),
                                this.b2d = new Ft(),
                                this.matrixPrinter = new Ft(),
                                this.output = new he(),
                                this.nop = new me();
                }
                setByRegistersInit(t) {
                        for (let [r, n] of Object.entries(t)) this.#t(r, n);
                }
                setCache(t) {
                        t instanceof b
                                ? t.registerCache = this.getBReg(t.regNumber)
                                : t instanceof E &&
                                        (t.registerCache = this.getUReg(
                                                t.regNumber,
                                        ));
                }
                #t(t, r) {
                        if (t.startsWith("U")) {
                                let n = pn(t.slice(1), 10);
                                fn(n) && tt(t, r);
                                let s = this.getUReg(n);
                                if (s === void 0) {
                                        throw Error(
                                                `Invalid #REGISTERS: U${n} isn't used in the program`,
                                        );
                                }
                                s.setByRegistersInit(t, r);
                        } else if (t.startsWith("B")) {
                                let n = pn(t.slice(1), 10);
                                fn(n) && tt(t, r);
                                let s = this.getBReg(n);
                                if (s === void 0) {
                                        throw Error(
                                                `Invalid #REGISTERS: B${n} isn't used in the program`,
                                        );
                                }
                                s.setByRegistersInit(t, r);
                        } else tt(t, r);
                }
                execAction(t) {
                        if (t instanceof b) {
                                return (t.registerCache ??
                                        this.bRegMap.get(t.regNumber) ??
                                        Gt("B", t.regNumber)).action(t);
                        }
                        if (t instanceof E) {
                                return (t.registerCache ??
                                        this.uRegMap.get(t.regNumber) ??
                                        Gt("U", t.regNumber)).action(t);
                        }
                        if (t instanceof I) return this.add.action(t);
                        if (t instanceof q) return this.nop.action();
                        if (t instanceof Q) return this.sub.action(t);
                        if (t instanceof j) return this.mul.action(t);
                        if (t instanceof X) {
                                if (t.kind === 1) {
                                        if (t.op === 2) {
                                                throw Error(
                                                        "PRINTER component cannot READ",
                                                );
                                        }
                                        return this.matrixPrinter.action(t);
                                } else return this.b2d.action(t);
                        } else {
                                if (t instanceof K) {
                                        return this.output.action(t);
                                }
                                if (t instanceof N) return -1;
                                if (t instanceof J) {
                                        return (this.legacyTRegMap.get(
                                                t.regNumber,
                                        ) ?? Gt("T", t.regNumber)).action(t);
                                }
                        }
                        throw Error(`execAction: unknown action ${t.pretty()}`);
                }
                execActionN(t, r) {
                        if (t instanceof E) {
                                return (t.registerCache ??
                                        this.uRegMap.get(t.regNumber) ??
                                        Gt("U", t.regNumber)).actionN(t, r);
                        }
                        if (t instanceof b) {
                                return (t.registerCache ??
                                        this.bRegMap.get(t.regNumber) ??
                                        Gt("B", t.regNumber)).actionN(t, r);
                        }
                        if (t instanceof N) return -1;
                        throw Error(`execActionN: ${t.pretty()}`);
                }
                getUReg(t) {
                        return this.uRegMap.get(t);
                }
                getBReg(t) {
                        return this.bRegMap.get(t);
                }
                addSubMulToUIString() {
                        return `
        ADD = ${this.add.toStringDetail()},
        SUB = ${this.sub.toStringDetail()},
        MUL = ${this.mul.toString()}
        `;
                }
        };
var as = [
                b.parse,
                E.parse,
                X.parse,
                q.parse,
                I.parse,
                j.parse,
                Q.parse,
                K.parse,
                N.parse,
                J.parse,
        ],
        ir = (e) => {
                for (let t of as) {
                        let r = t(e);
                        if (r !== void 0) return r;
                }
        };
var _ = (e) => e !== void 0 ? ` at line ${e}` : "";
function or(e, t, r, n) {
        if (e = e.trim(), !e.startsWith("{")) {
                return `Invalid line "${r}"${
                        _(t)
                }. ${n} replacements does not start with "{"`;
        }
        if (!e.endsWith("}")) {
                return `Invalid line "${r}"${
                        _(t)
                }. ${n} replacements does not end with "}"`;
        }
        try {
                return e.slice(1, -1).slice().split(";").map((s) => {
                        let i = s.trim().split("=").map((o) => o.trim());
                        if (i.length != 2) {
                                throw new Error(
                                        `Invalid line "${r}"${
                                                _(t)
                                        }. #DEFINE invalid replacements`,
                                );
                        }
                        return {
                                needle: i[0] ?? u(),
                                replacement: i[1] ?? u(),
                        };
                });
        } catch (s) {
                return s instanceof Error ? s.message : u();
        }
}
var Vt = "INITIAL",
        B = class {
                pretty() {
                        return "";
                }
        },
        dt = class e extends B {
                constructor(t) {
                        super(), this.content = t;
                }
                static get key() {
                        return "#COMPONENTS";
                }
                pretty() {
                        return e.key + " " + this.content;
                }
        },
        mt = class e extends B {
                constructor(t) {
                        super(), this.content = t;
                }
                static get key() {
                        return "#REGISTERS";
                }
                pretty() {
                        return e.key + " " + this.content;
                }
        };
function dn(e) {
        return "{ " + e.map((t) =>
                t.needle + " = " + t.replacement
        ).join("; ") + " }";
}
var ht = class e extends B {
                constructor(t, r) {
                        super(), this.name = t, this.defaultReplacements = r;
                }
                static get key() {
                        return "#DEFINE";
                }
                pretty() {
                        return e.key + " " + this.name +
                                (this.defaultReplacements.length === 0
                                        ? ""
                                        : " " + dn(this.defaultReplacements));
                }
        },
        rt = class e extends B {
                constructor() {
                        super();
                }
                static get key() {
                        return "#ENDDEF";
                }
                pretty() {
                        return e.key;
                }
        },
        et = class e extends B {
                constructor(t, r) {
                        super(), this.templateName = t, this.replacements = r;
                }
                static get key() {
                        return "#INSERT";
                }
                pretty() {
                        return e.key + " " + this.templateName +
                                (this.replacements.length === 0
                                        ? ""
                                        : " " + dn(this.replacements));
                }
        },
        gt = class extends B {
                constructor(t) {
                        super(), this.filename = t;
                }
                static get key() {
                        return "#INCLUDE";
                }
                pretty() {
                        return et.key + " " + this.filename;
                }
        },
        ar = class extends B {
                constructor(t) {
                        super(), this.str = t;
                }
                getString() {
                        return this.str;
                }
                pretty() {
                        return this.getString();
                }
        },
        cr = class extends B {
                constructor() {
                        super();
                }
                pretty() {
                        return "";
                }
        },
        cs = (e) => {
                switch (e) {
                        case "Z":
                                return e;
                        case "NZ":
                                return e;
                        case "ZZ":
                                return e;
                        case "*":
                                return e;
                        default:
                                return;
                }
        },
        wt = class extends B {
                constructor(
                        {
                                state: t,
                                input: r,
                                nextState: n,
                                actions: s,
                                line: i,
                        },
                ) {
                        super(),
                                this.state = t,
                                this.input = r,
                                this.nextState = n,
                                this.actions = s,
                                this.line = i,
                                this._string = `${this.state}; ${this.input};${
                                        " ".repeat(2 - this.input.length)
                                } ${this.nextState}; ${
                                        this.actions.map((o) => o.pretty())
                                                .join(", ")
                                }`;
                }
                pretty() {
                        return this._string;
                }
        },
        ur = (e, t) => {
                let r = e.trim();
                if (r === "") return new cr();
                if (r.startsWith("#")) {
                        if (r.startsWith(dt.key)) {
                                return new dt(r.slice(dt.key.length).trim());
                        }
                        if (r.startsWith(mt.key)) {
                                return new mt(r.slice(mt.key.length).trim());
                        }
                        if (r.startsWith(ht.key)) {
                                let h = r.slice(ht.key.length).trim();
                                if (h.length === 0) {
                                        return `Invalid line "${e}"${
                                                _(t)
                                        }. #DEFINE needs a name.`;
                                }
                                let S, $ = [], R = h.indexOf("{");
                                if (R !== -1) {
                                        S = h.slice(0, R).trim();
                                        let T = or(h.slice(R), t, e, "#DEFINE");
                                        if (typeof T == "string") return T;
                                        $ = T;
                                } else S = h;
                                return new ht(S, $ ?? []);
                        } else {
                                if (r.startsWith(rt.key)) return new rt();
                                if (r.startsWith(et.key)) {
                                        let h = r.slice(et.key.length).trim();
                                        if (h.length === 0) {
                                                return `Invalid line "${e}"${
                                                        _(t)
                                                }. #INSERT needs a name.`;
                                        }
                                        let S, $ = [], R = h.indexOf("{");
                                        if (R !== -1) {
                                                S = h.slice(0, R).trim();
                                                let T = or(
                                                        h.slice(R),
                                                        t,
                                                        e,
                                                        "#INSERT",
                                                );
                                                if (typeof T == "string") {
                                                        return T;
                                                }
                                                $ = T;
                                        } else S = h;
                                        return new et(S, $);
                                } else if (r.startsWith(gt.key)) {
                                        let h = r.slice(gt.key.length).trim();
                                        return h === ""
                                                ? `Invalid line "${e}"${
                                                        _(t)
                                                }. #INCLUDE needs filename.`
                                                : new gt(h);
                                }
                        }
                        return new ar(e);
                }
                let s = (r.split("#")[0] ?? "").split(/\s*;\s*/u);
                if (s.length < 4) return `Invalid line "${e}"${_(t)}`;
                if (s.length > 4) {
                        return s[4] === ""
                                ? `Extraneous semicolon "${e}"${_(t)}`
                                : `Invalid line "${e}"${_(t)}`;
                }
                let i = s[0] ?? u(),
                        o = s[1] ?? u(),
                        a = s[2] ?? u(),
                        l = (s[3] ?? u()).trim().split(/\s*,\s*/u).filter((h) =>
                                h !== ""
                        ),
                        d = [];
                for (let h of l) {
                        let S = ir(h);
                        if (S === void 0) {
                                return `Unknown action "${h}" in "${e}"${_(t)}`;
                        }
                        d.push(S);
                }
                let m = cs(o);
                return m === void 0
                        ? `Unknown input "${o}" in "${e}"${
                                _(t)
                        }. Expect "Z", "NZ", "ZZ" or "*"`
                        : new wt({
                                state: i,
                                input: m,
                                nextState: a,
                                actions: d,
                                line: t,
                        });
        },
        Z = (e) => _(e.line),
        D = (e) => `"${e.pretty()}"${Z(e)}`;
var mn = (e) => {
        let t = e.actions;
        if (t.some((n) => n instanceof N)) return;
        let r = t.filter((n) => n.doesReturnValue());
        if (r.length !== 1) {
                return r.length === 0
                        ? `Does not return a value in ${D(e)}`
                        : `Does not contain exactly one action that returns a value in "${e.pretty()}": Actions that produce value are ${
                                r.map((n) => `"${n.pretty()}"`).join(", ")
                        }${Z(e)}`;
        }
};
var hn = (e) => {
        if (e.nextState === Vt) return `Return to initial state in ${D(e)}`;
};
var gn = (e) => {
        let t = e.actions;
        if (t.length <= 1) return;
        let r = t.map((s) => s.pretty());
        r.sort();
        let n = r.length - 1;
        for (let s = 0; s < n; s++) {
                let i = r[s], o = r[s + 1];
                if (i === o) return `Duplicated actions "${i}" in ${D(e)}`;
        }
};
var xn = (e) => {
        let t = e.actions;
        if (t.some((n) => n instanceof N)) return;
        let r = t.length;
        if (!(r <= 1)) {
                for (let n = 0; n < r; n++) {
                        let s = t[n] ?? u();
                        for (let i = n + 1; i < r; i++) {
                                let o = t[i] ?? u();
                                if (s.isSameComponent(o)) {
                                        return `Actions "${s.pretty()}" and "${o.pretty()}" use same component in ${
                                                D(e)
                                        }`;
                                }
                        }
                }
        }
};
var us = (e, t) =>
                e.line !== void 0 && t?.line !== void 0
                        ? ` at line ${e.line} and ${t.line}`
                        : "",
        yn = (e) => {
                if (e.length === 0) return;
                let t = (s, i) =>
                                `Need Z line followed by NZ line in "${s.pretty()}"${
                                        us(s, i)
                                }`,
                        r = e.length - 1;
                for (let s = 0; s < r; s++) {
                        let i = e[s] ?? u(),
                                o = e[s + 1] ?? u(),
                                a = i.input,
                                c = o.input;
                        if (
                                a === "Z" && c !== "NZ" ||
                                c === "NZ" && a !== "Z" ||
                                a === "Z" && c === "NZ" && i.state !== o.state
                        ) return [t(i, o)];
                }
                let n = e[r];
                if (n?.input === "Z") return [t(n)];
        };
var nt = class e {
        constructor(t, r = new Map()) {
                this.templates = r, this.array = t;
        }
        getArray() {
                return this.array;
        }
        getTemplates() {
                return this.templates;
        }
        pretty() {
                return this.array.map((t) => t.pretty()).join(`
`);
        }
        static parse(t) {
                let r = t.split(/\r\n|\n|\r/u),
                        n = [],
                        s = [],
                        i = new Map(),
                        o = null;
                for (let [a, c] of r.entries()) {
                        if (o != null) {
                                if (
                                        c.trimStart().startsWith(rt.key) &&
                                        ur(c, a + 1) instanceof rt
                                ) {
                                        o = null;
                                        continue;
                                }
                                let d = i.get(o);
                                d == null && u(), d.lines.push(c);
                                continue;
                        }
                        let l = ur(c, a + 1);
                        if (l instanceof ht) {
                                if (o != null) {
                                        return `#DEFINE needs #ENDDEF ${l.pretty()}`;
                                }
                                if (o = l.name, i.has(o)) {
                                        return `#DEFINE duplicate template name ${l.pretty()}`;
                                }
                                i.set(o, {
                                        defaultReplacements:
                                                l.defaultReplacements,
                                        lines: [],
                                });
                        } else {
                                if (l instanceof rt) {
                                        return `#ENDDEF needs #DEFINE ${l.pretty()}`;
                                }
                                l instanceof B
                                        ? s.push(l)
                                        : typeof l == "string"
                                        ? n.push(l)
                                        : u();
                        }
                }
                return o != null && n.push(`#DEFINE needs #ENDDEF. "${o}"`),
                        n.length > 0
                                ? n.join(`
`)
                                : new e(s, i);
        }
};
var bn = (e) => {
        let t = [];
        {
                let r = [gn, mn, xn, hn];
                for (let n of e) {
                        for (let s of r) {
                                let i = s(n);
                                typeof i == "string" && t.push(i);
                        }
                }
        }
        {
                let r = [yn];
                for (let n of r) {
                        let s = n(e);
                        s !== void 0 && (t = t.concat(s));
                }
        }
        if (t.length > 0) {
                return t.join(`
`);
        }
};
function ls(e, t, r) {
        let n = e;
        for (let s of r.concat(t.defaultReplacements)) {
                n = n.replaceAll(s.needle, s.replacement);
        }
        return n;
}
function Sn(e, t) {
        let r = [],
                n = new Map(e.getTemplates().entries()),
                s = e.getArray().slice().reverse();
        function i(o) {
                let a = o.getArray();
                for (let c = a.length - 1; c >= 0; c--) s.push(a[c] ?? u());
                for (let [c, l] of o.getTemplates()) {
                        if (n.get(c) != null) {
                                throw new Error(
                                        `#DEFINE duplicate template name "${c}"`,
                                );
                        }
                        n.set(c, l);
                }
        }
        for (; s.length >= 1;) {
                let o = s.pop();
                if (o instanceof wt) r.push(o);
                else if (o instanceof gt) {
                        let a = t.find((c) => c.name === o.filename);
                        if (a == null) {
                                throw new Error(
                                        `#INCLUDE file not found: "${o.filename}". Add a library file.`,
                                );
                        }
                        i(a.programLines);
                } else if (o instanceof et) {
                        let a = n.get(o.templateName);
                        if (a == null) {
                                throw new Error(
                                        `Undefined template: "${o.templateName}" at line "${o.pretty()}"`,
                                );
                        }
                        let c = a.lines.map((d) => ls(d, a, o.replacements))
                                        .join(`
`),
                                l = nt.parse(c);
                        if (typeof l == "string") throw new Error(l);
                        i(l);
                }
        }
        return r;
}
var En = "CLOCK-2^";
function Nn(e) {
        let t = [], r = e.split(",").map((n) => n.trim());
        for (let n of r) {
                if (n !== "..." && !(n === "NOP" || n === "HALT_OUT")) {
                        if (
                                n === "OUTPUT" || n === "B2D" ||
                                n === "PRINTER" || n === "ADD" || n === "SUB" ||
                                n === "MUL"
                        ) t.push(n);
                        else if (n.startsWith(En)) {
                                let s = Number(n.slice(En.length));
                        } else {
                                let s = n.startsWith("B")
                                        ? "B"
                                        : n.startsWith("U")
                                        ? "U"
                                        : null;
                                if (s) {
                                        let i = ps(n.slice(1));
                                        for (
                                                let o of i.map((a) =>
                                                        `${s}${a}`
                                                )
                                        ) t.push(o);
                                }
                        }
                }
        }
        return t;
}
function ps(e) {
        let t = e.split("-");
        if (t.length === 1) {
                let r = t[0];
                if (r?.length === 0) throw new Error("Invalid #COMPONENTS");
                let n = Number(r);
                if (Number.isNaN(n)) throw new Error("Invalid #COMPONENTS");
                return [n];
        } else if (t.length === 2) {
                if (t.some((i) => i.length === 0)) {
                        throw new Error("Invalid #COMPONENTS");
                }
                let [r, n] = t.map((i) => Number(i));
                if (
                        r == null || n == null || Number.isNaN(r) ||
                        Number.isNaN(n)
                ) throw new Error("Invalid #COMPONENTS");
                if (r >= 100 || n >= 100) {
                        throw new Error(
                                "Invalid #COMPONENTS: range declaration must be less than 100",
                        );
                }
                let s = [];
                for (let i = r; i < n + 1; i++) s.push(i);
                return s;
        }
        throw new Error("Invalid #COMPONENTS");
}
var Yt = class e {
                constructor(t, r, n) {
                        this.commands = t,
                                this.componentsHeader = r,
                                this.registersHeader = n;
                }
                static parse(t, { noValidate: r, libraryFiles: n } = {}) {
                        let s = nt.parse(t);
                        if (typeof s == "string") return s;
                        let i = [];
                        for (let a of n ?? []) {
                                let c = nt.parse(a.content);
                                if (typeof c == "string") return c;
                                i.push({ name: a.name, programLines: c });
                        }
                        let o = Sn(s, i);
                        if (!r) {
                                if (o.length === 0) return "Program is empty";
                                let a = bn(o);
                                if (typeof a == "string") return a;
                        }
                        return new e(
                                o,
                                s.getArray().flatMap((a) =>
                                        a instanceof dt ? [a] : []
                                ),
                                s.getArray().flatMap((a) =>
                                        a instanceof mt ? [a] : []
                                ),
                        );
                }
        },
        fs = (e) => [...new Set(e)].sort((t, r) => t - r),
        wn = [
                { key: "hasAdd", component: "ADD" },
                { key: "hasSub", component: "SUB" },
                { key: "hasMul", component: "MUL" },
                { key: "hasB2D", component: "B2D" },
                { key: "hasPrinter", component: "PRINTER" },
                { key: "hasOutput", component: "OUTPUT" },
        ],
        lr = (e) => {
                let t = e.commands.flatMap((l) => l.actions),
                        r = (l) =>
                                fs(t.flatMap((d) =>
                                        d instanceof l ? [d.regNumber] : []
                                )),
                        n = !1,
                        s = !1,
                        i = !1,
                        o = !1,
                        a = !1,
                        c = !1;
                for (let l of t) {
                        l instanceof I
                                ? n = !0
                                : l instanceof Q
                                ? s = !0
                                : l instanceof j
                                ? i = !0
                                : l instanceof X
                                ? l.kind === 1 ? a = !0 : o = !0
                                : l instanceof K && (c = !0);
                }
                return {
                        unary: r(E),
                        binary: r(b),
                        legacyT: r(J),
                        hasAdd: n,
                        hasSub: s,
                        hasMul: i,
                        hasB2D: o,
                        hasPrinter: a,
                        hasOutput: c,
                };
        },
        _n = (e, t) => {
                let r = [],
                        n = new Set(e.flatMap((a) => Nn(a.content))),
                        s = (a) =>
                                `Program uses ${a} component but the #COMPONENTS header does not include it.`;
                for (let { key: a, component: c } of wn) {
                        t[a] && !n.has(c) && r.push(s(c));
                }
                let i = [];
                for (let a of t.unary) n.has("U" + a) || i.push(a);
                i.length > 0 &&
                        r.push(`Program uses ${
                                i.map((a) => "U" + a).join(", ")
                        } component${
                                i.length === 1 ? "" : "s"
                        } but the #COMPONENTS header does not include ${
                                i.length === 1 ? "it" : "them"
                        }.`);
                let o = [];
                for (let a of t.binary) n.has("B" + a) || o.push(a);
                if (
                        o.length > 0 && r.push(`Program uses ${
                                o.map((a) => "B" + a).join(", ")
                        } component${
                                o.length === 1 ? "" : "s"
                        } but the #COMPONENTS header does not include ${
                                o.length === 1 ? "it" : "them"
                        }.`),
                                r.length !== 0
                ) {
                        let a = Tn(t);
                        throw r.push(`Suggested header: #COMPONENTS ${a}`),
                                new Error(r.join(`
`));
                }
        };
function $n(e) {
        let t = e.length;
        if (t === 0) return [];
        let r = [], n = e[0], s = e[0] ?? u();
        for (let i = 1; i < t; i++) {
                let o = e[i] ?? u();
                o === s + 1 || (r.push(n === s ? `${n}` : `${n}-${s}`), n = o),
                        s = o;
        }
        return r.push(n === s ? `${n}` : `${n}-${s}`), r;
}
var Tn = (e) => {
        let t = [], r = e.binary.slice().sort((s, i) => s - i);
        t = t.concat($n(r).map((s) => "B" + s));
        let n = e.unary.slice().sort((s, i) => s - i);
        t = t.concat($n(n).map((s) => "U" + s));
        for (let { key: s, component: i } of wn) e[s] && t.push(i);
        return t.join(", ");
};
var ds = (e) => e instanceof b && e.op === 0,
        ms = (e) => e instanceof E && e.op === 1,
        hs = (e) => {
                if (
                        e.input === "NZ" && e.state === e.nextState &&
                        e.actions.every((t) => !(t instanceof N)) &&
                        e.actions.every((t) => t instanceof E || ds(t))
                ) {
                        let t = e.actions.find(ms);
                        if (t && t instanceof E) return { tdecU: t };
                }
        },
        gs = (e) => {
                if (
                        e.input === "NZ" && e.state === e.nextState &&
                        e.actions.every((t) => !(t instanceof N)) &&
                        e.actions.length === 1 && e.actions.every((t) =>
                                t instanceof b
                        )
                ) {
                        let t = e.actions.find((r) =>
                                r instanceof b && r.op === 1
                        );
                        if (t && t instanceof b) return { tdecB: t };
                }
        },
        _t = class {
                constructor(t, r) {
                        this.command = t,
                                this.nextState = r,
                                this.tdecuOptimize = hs(t),
                                this.tdecbOptimize = gs(t);
                }
        };
var fr = class {
                constructor(t, r) {
                        this.z = t, this.nz = r;
                }
        },
        pr = (e, t) => {
                throw Error(
                        `Duplicated command: "${e.pretty()}" and "${t.pretty()}"${
                                Z(t)
                        }`,
                );
        },
        In = (e) => {
                let t = new Map(), r = [];
                for (let n of e) {
                        t.has(n.state) ||
                                (t.set(n.state, t.size),
                                        r.push(new fr(void 0, void 0)));
                }
                for (let n of e) {
                        let s = r[t.get(n.state) ?? u()] ?? u(),
                                i = t.get(n.nextState);
                        if (i === void 0) {
                                throw Error(
                                        `Unknown state: "${n.nextState}" at "${n.pretty()}"${
                                                Z(n)
                                        }`,
                                );
                        }
                        switch (n.input) {
                                case "Z": {
                                        s.z === void 0
                                                ? s.z = new _t(n, i)
                                                : pr(s.z.command, n);
                                        break;
                                }
                                case "NZ": {
                                        s.nz === void 0
                                                ? s.nz = new _t(n, i)
                                                : pr(s.nz.command, n);
                                        break;
                                }
                                case "ZZ": {
                                        if (s.nz !== void 0) {
                                                throw Error(
                                                        `Invalid input: ZZ with NZ or *: "${n.pretty()}" and "${s.nz.command.pretty()}"${
                                                                Z(n)
                                                        }`,
                                                );
                                        }
                                        s.z === void 0
                                                ? s.z = new _t(n, i)
                                                : pr(s.z.command, n);
                                        break;
                                }
                                case "*": {
                                        if (s.nz !== void 0) {
                                                throw Error(
                                                        `Invalid input: * "${n.pretty()}" and "${s.nz.command.pretty()}"${
                                                                Z(n)
                                                        }`,
                                                );
                                        }
                                        if (s.z !== void 0) {
                                                throw Error(
                                                        `Invalid input: * "${n.pretty()}" and "${s.z.command.pretty()}"${
                                                                Z(n)
                                                        }`,
                                                );
                                        }
                                        {
                                                let o = new _t(n, i);
                                                s.z = o, s.nz = o;
                                        }
                                        break;
                                }
                                default:
                                        u();
                        }
                }
                return { states: [...t.keys()], stateMap: t, lookup: r };
        };
var M = (e = "error") => {
                throw Error(e);
        },
        Zt = class e {
                constructor(t) {
                        this.stepCount = 0;
                        let r = lr(t);
                        this.actionExecutor = new ye(r), this.prevOutput = 0;
                        let { states: n, stateMap: s, lookup: i } = In(
                                t.commands,
                        );
                        this.lookup = i;
                        for (let a of i) {
                                let c = (a.z?.command.actions ?? []).concat(
                                        a.nz?.command.actions ?? [],
                                );
                                for (let l of c) {
                                        this.actionExecutor.setCache(l);
                                }
                        }
                        this.currentStateIndex = s.get(Vt) ??
                                M(`${Vt} state is not present`),
                                this.stateStatsArray = [],
                                this.states = n,
                                this.stateMap = s,
                                this.program = t,
                                this.analyzeResult = r;
                        for (let a = 0; a < i.length * 2; a++) {
                                this.stateStatsArray.push(0);
                        }
                        let o = t.registersHeader;
                        for (let a of o) this.#t(a);
                        t.componentsHeader.length > 0 &&
                                _n(t.componentsHeader, r);
                }
                static fromString(t, r) {
                        let n = Yt.parse(t, { libraryFiles: r ?? [] });
                        if (typeof n == "string") throw Error(n);
                        return new e(n);
                }
                getStateStats() {
                        let t = this.stateStatsArray, r = t.length, n = [];
                        for (let s = 0; s < r; s += 2) {
                                n.push({ z: t[s] ?? M(), nz: t[s + 1] ?? M() });
                        }
                        return n;
                }
                #t(t) {
                        let r = t.content.replace(/'/ug, '"'), n = {};
                        try {
                                n = JSON.parse(r);
                        } catch {
                                M(`Invalid #REGISTERS: is not a valid JSON: "${r}"`);
                        }
                        (n === null || typeof n != "object") &&
                        M(`Invalid #REGISTERS: "${r}" is not an object`),
                                this.actionExecutor.setByRegistersInit(n);
                }
                getCurrentState() {
                        let t = this.states[this.currentStateIndex];
                        return t === void 0 && M("State name is not found"), t;
                }
                getStateMap() {
                        return this.stateMap;
                }
                getPreviousOutput() {
                        return this.prevOutput === 0 ? "Z" : "NZ";
                }
                getNextCommand() {
                        let t = this.currentStateIndex, r = this.lookup[t];
                        if (
                                r === void 0 &&
                                M(`Internal Error: Next command is not found: Current state index: ${t}`),
                                        this.prevOutput === 0
                        ) {
                                let s = r.z;
                                if (s !== void 0) return s;
                        } else {
                                let s = r.nz;
                                if (s !== void 0) return s;
                        }
                        M(
                                "Next command is not found: Current state = " +
                                        this.getCurrentState() + ", output = " +
                                        this.getPreviousOutput(),
                        );
                }
                _internalExecActionN(t, r) {
                        try {
                                let s = this.actionExecutor;
                                for (let i of t.actions) s.execActionN(i, r);
                        } catch (s) {
                                if (s instanceof Error) this.#r(s);
                                else throw s;
                        }
                        let n = this.currentStateIndex * 2 + this.prevOutput;
                        this.stateStatsArray[n] =
                                (this.stateStatsArray[n] ?? 0) + r,
                                this.stepCount += r;
                }
                exec(t, r, n, s) {
                        let i = n !== -1, o = r ? null : performance.now();
                        for (let a = 0; a < t; a++) {
                                let c = this.getNextCommand(),
                                        l = c.tdecuOptimize;
                                if (l) {
                                        let m = l.tdecU.registerCache
                                                ?.getValue();
                                        if (m !== void 0 && m !== 0) {
                                                m = Math.min(m, t - a),
                                                        this._internalExecActionN(
                                                                c.command,
                                                                m,
                                                        ),
                                                        a += m - 1;
                                                continue;
                                        }
                                } else if (c.tdecbOptimize) {
                                        let m = c.tdecbOptimize.tdecB
                                                .registerCache?.pointer;
                                        if (m !== void 0 && m !== 0) {
                                                m = Math.min(m, t - a),
                                                        this._internalExecActionN(
                                                                c.command,
                                                                m,
                                                        ),
                                                        a += m - 1;
                                                continue;
                                        }
                                }
                                try {
                                        if (this.execCommandFor(c) === -1) {
                                                return "Halted";
                                        }
                                } catch (d) {
                                        if (d instanceof Error) this.#r(d);
                                        else throw d;
                                }
                                if (
                                        i && this.currentStateIndex === n &&
                                        (s === -1 || s === this.prevOutput)
                                ) return "Stop";
                                if (
                                        r && (a + 1) % 5e5 === 0 &&
                                        o !== null &&
                                        performance.now() - o >= 50
                                ) return;
                        }
                }
                #r(t) {
                        let r = this.getNextCommand().command;
                        return M(t.message + " in " + D(r));
                }
                execCommandFor(t) {
                        this.stepCount += 1;
                        {
                                let o = this.currentStateIndex,
                                        a = this.prevOutput,
                                        c = o * 2 + a;
                                this.stateStatsArray[c] =
                                        (this.stateStatsArray[c] ?? 0) + 1;
                        }
                        let r = -1, n = this.actionExecutor, s = t.command;
                        for (let o of s.actions) {
                                let a = n.execAction(o);
                                if (a === -1) return -1;
                                a !== void 0 &&
                                        (r === -1
                                                ? r = a
                                                : M(`Return value twice: line = ${
                                                        D(s)
                                                }`));
                        }
                        r === -1 && M(`No return value: line = ${D(s)}`);
                        let i = t.nextState;
                        this.currentStateIndex = i, this.prevOutput = r;
                }
                execCommand() {
                        return this.execCommandFor(this.getNextCommand());
                }
        };
function f(e, t = void 0) {
        let r = document.createElement(e);
        if (typeof t == "string") r.textContent = t;
        else if (
                t != null && typeof t == "object" &&
                (t.text && (r.textContent = t.text),
                        t.classes && r.classList.add(...t.classes),
                        t.fn && (t.fn(r), t.fn = void 0),
                        t.children && r.append(...t.children),
                        t.style)
        ) {
                for (let [n, s] of Object.entries(t.style)) {
                        n in r.style
                                ? r.style[n] = s
                                : r.style.setProperty(n, s);
                }
        }
        return r;
}
var xs = "Start",
        ys = "Stop",
        Bn = "btn-primary",
        Dn = "btn-danger",
        Rn = (e) =>
                `<svg width="16" height="16" viewBox="0 0 16 16">${e}</svg>`,
        bs = () => {
                let e = f("div");
                return e.innerHTML =
                        Rn('<path stroke="currentColor" stroke-width="1" d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>') +
                        xs,
                        e;
        },
        Ss = bs(),
        Es = () => {
                let e = f("div");
                return e.innerHTML =
                        Rn('<path stroke="currentColor" stroke-width="1" d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z"/>') +
                        ys,
                        e;
        },
        Ns = Es();
function Wt(e) {
        e.disabled = !1,
                e.replaceChildren(Ss),
                e.classList.add(Bn),
                e.classList.remove(Dn);
}
function An(e) {
        e.disabled = !1,
                e.replaceChildren(Ns),
                e.classList.remove(Bn),
                e.classList.add(Dn);
}
function vn(e, t, r) {
        if (e.replaceChildren(), t === "RuntimeError" || t === "ParseError") {
                let n = r.split(`
`);
                for (let s of n) e.append(f("span", "- " + s), f("br"));
                e.classList.remove("d-none");
        } else e.classList.add("d-none");
}
var Xt = 40, be = window.innerWidth;
be >= 1200
        ? Xt = 120
        : be >= 992
        ? Xt = 100
        : be >= 768
        ? Xt = 70
        : be >= 576 && (Xt = 50);
var Cn = (e, t) => {
        if (t = t ?? "", e.value === t) return;
        e.value = t;
        let r = t.length, s = Math.min(6, Math.max(1, Math.ceil(r / Xt)));
        e.rows = s;
};
function* Ln(e, t) {
        if (!Number.isInteger(t)) throw RangeError("size is not an integer");
        let r = [];
        for (let n of e) r.push(n), t <= r.length && (yield r, r = []);
        r.length !== 0 && (yield r);
}
var $s = (e) => {
                if (window.innerWidth < 768) return e === 9 ? e : 8;
                let r = 12;
                return r + 1 <= e && e <= r + 2 ? e : r;
        },
        ws = (e) => f("th", { text: `U${e}`, classes: ["text-end"] }),
        _s = (e, t) =>
                f("td", {
                        text: t.getValue().toString(),
                        fn: (r) => {
                                r.dataset.test = `U${e}`;
                        },
                        classes: ["text-end"],
                }),
        Ts = (e) => {
                let t = [], r = [], n = $s(e.size);
                for (let i of Ln(e, n)) {
                        let o = f("tr"), a = f("tr");
                        for (let [c, l] of i) {
                                o.append(ws(c));
                                let d = _s(c, l);
                                t.push(d), a.append(d);
                        }
                        r.push({ header: o, data: a });
                }
                let s = f("table");
                for (let i of r) s.append(i.header, i.data);
                return s.classList.add("table"),
                        s.style.tableLayout = "fixed",
                        s.style.marginBottom = "0",
                        { table: s, cells: t };
        },
        Se = class {
                #t;
                #r;
                constructor(t) {
                        this.#t = t, this.#r = [];
                }
                initialize(t) {
                        let { table: r, cells: n } = Ts(t);
                        this.#t.replaceChildren(r), this.#r = n;
                }
                clear() {
                        this.#r = [], this.#t.innerHTML = "";
                }
                render(t) {
                        let r = 0, n = this.#r;
                        for (let s of t.values()) {
                                let i = n[r] ?? u();
                                i.textContent = s.getValue().toString(), r++;
                        }
                }
        };
var Is = () => {
                let e = f("span", { classes: ["decimal"] }),
                        t = f("span", { classes: ["hex"] }),
                        r = f("span", { classes: ["max_pointer"] }),
                        n = f("span", { classes: ["pointer"] });
                return {
                        metaData: f("code", {
                                classes: ["binary_info", "word-break-all"],
                                children: [e, t, r, n],
                        }),
                        $decimal: e,
                        $hex: t,
                        $maxPointer: r,
                        $pointer: n,
                };
        },
        Bs = () => {
                let e = f("span", { classes: ["prefix"] }),
                        t = f("span", { classes: ["binary-head"] }),
                        r = f("span", { classes: ["suffix"] });
                return {
                        binaryBits: f("code", {
                                classes: ["word-break-all"],
                                children: [e, t, r],
                        }),
                        $prefix: e,
                        $head: t,
                        $suffix: r,
                };
        },
        Ee = class {
                #t;
                #r;
                constructor(t) {
                        this.#t = t, this.#r = [];
                }
                initialize(t) {
                        this.clear();
                        let r = [], n = f("table");
                        for (let s of t.keys()) {
                                let i = f("td");
                                i.dataset.test = `B${s}`;
                                let {
                                        metaData: o,
                                        $decimal: a,
                                        $hex: c,
                                        $maxPointer: l,
                                        $pointer: d,
                                } = Is();
                                i.append(o, f("br"));
                                let {
                                        binaryBits: m,
                                        $prefix: h,
                                        $head: S,
                                        $suffix: $,
                                } = Bs();
                                i.append(m);
                                let R = f("tr", {
                                        children: [f("th", `B${s}`), i],
                                });
                                n.append(R),
                                        r.push({
                                                $decimal: a,
                                                $hex: c,
                                                $maxPointer: l,
                                                $pointer: d,
                                                $prefix: h,
                                                $head: S,
                                                $suffix: $,
                                        });
                        }
                        this.#t.append(n), this.#r = r;
                }
                clear() {
                        this.#r = [], this.#t.innerHTML = "";
                }
                render(t, r, n, s, i) {
                        let o = 0, a = this.#r;
                        for (let c of t.values()) {
                                let {
                                        $prefix: l,
                                        $head: d,
                                        $suffix: m,
                                        $decimal: h,
                                        $hex: S,
                                        $maxPointer: $,
                                        $pointer: R,
                                } = a[o] ?? u();
                                if (r) {
                                        l.innerHTML = "",
                                                d.innerHTML = "",
                                                m.innerHTML = "";
                                } else {
                                        let T = c.toObject();
                                        l.textContent = n
                                                ? nr(T.suffix)
                                                : sr(T.prefix),
                                                d.textContent = T.head
                                                        .toString(),
                                                m.textContent = n
                                                        ? nr(T.prefix)
                                                        : sr(T.suffix);
                                }
                                s
                                        ? h.textContent = "value = " +
                                                c.toNumberString(10) + ", "
                                        : h.innerHTML = "",
                                        i
                                                ? S.textContent = "hex = " +
                                                        c.toNumberString(16) +
                                                        ", "
                                                : S.innerHTML = "",
                                        $.textContent = "max_pointer = " +
                                                (c.getLength() - 1) + ", ",
                                        R.textContent = "pointer = " +
                                                c.pointer.toString(),
                                        o++;
                        }
                }
        };
function jt(e) {
        e.reset
                ? e.reset()
                : (e.clearRect(0, 0, e.canvas.width, e.canvas.height),
                        e.resetTransform(),
                        e.beginPath());
}
var dr = (e, t, r, n) => {
        let s = Math.min(window.devicePixelRatio || 1, 4), i = 300 * s;
        (e.canvas.width !== i || e.canvas.height !== i) &&
        (e.canvas.width = i,
                e.canvas.height = i,
                e.canvas.style.width = `${(i / s).toFixed(0)}px`,
                e.canvas.style.height = `${(i / s).toFixed(0)}px`),
                jt(e);
        let o = t.getMaxX(), a = t.getMaxY(), c = Math.max(o, a) + 1, l = i / c;
        n || (e.scale(1, -1), e.translate(0, -i));
        let d = t.getArray();
        e.fillStyle = "#212529";
        for (let m = 0; m <= a; m++) {
                let h = d[m] ?? u(), S = m * l;
                for (let $ = 0; $ <= o; $++) {
                        h[$] === 1 && e.rect($ * l, S, l, l);
                }
        }
        e.fill(),
                r ||
                (e.strokeStyle = "#03A9F4",
                        e.lineWidth = 4,
                        e.strokeRect(t.x * l, t.y * l, l, l));
};
var k = (e) => e.toLocaleString();
var Mn = "stats_current_state",
        Ds = (e, { z: t, nz: r }) => {
                let n = f("td", {
                                fn: (l) => {
                                        l.colSpan = 2;
                                },
                                children: [f("code", e)],
                        }),
                        s = "num",
                        i = f("td", { text: k(t + r), classes: [s] }),
                        o = f("td", { text: k(t), classes: [s] }),
                        a = f("td", { text: k(r), classes: [s] });
                return {
                        $tr: f("tr", { children: [n, i, o, a] }),
                        $sum: i,
                        $z: o,
                        $nz: a,
                };
        },
        Ne = class {
                #t;
                constructor(t, r) {
                        this.root = t, this.#t = r, this.cells = [];
                }
                initialize(t, r) {
                        this.#t.textContent = k(r.length),
                                this.cells = [],
                                this.root.innerHTML = "";
                        for (let [n, s] of t.entries()) {
                                let i = r[n] ?? "",
                                        { $tr: o, $sum: a, $z: c, $nz: l } = Ds(
                                                i,
                                                s,
                                        );
                                this.root.append(o),
                                        this.cells.push({
                                                $sum: a,
                                                $z: c,
                                                $nz: l,
                                                $tr: o,
                                        });
                        }
                }
                clear() {
                        this.#t.innerHTML = "",
                                this.cells = [],
                                this.root.innerHTML = "";
                }
                render(t, r) {
                        let n = t, s = this.cells, i = s.length;
                        for (let o = 0; o < i; o++) {
                                let a = s[o] ?? u();
                                r === o
                                        ? a.$tr.classList.add(Mn)
                                        : a.$tr.classList.remove(Mn);
                                let { z: c, nz: l } = n[o] ?? u();
                                a.$sum.textContent = k(c + l),
                                        a.$z.textContent = k(c),
                                        a.$nz.textContent = k(l);
                        }
                }
        };
function kn(e, t) {
        if (e.innerHTML = "", t === void 0) return;
        let r = f("option", "None");
        r.value = "-1", r.selected = !0, e.append(r);
        for (let [n, s] of t.getStateMap()) {
                let i = f("option", n);
                i.value = s.toString(), e.append(i);
        }
}
function Un(e) {
        switch (e.value) {
                case "*":
                        return -1;
                case "Z":
                        return 0;
                default:
                        return 1;
        }
}
var $e = class {
        #t = 0;
        #r = -1;
        #e = !1;
        #i = 0;
        #s = 0;
        constructor(t, { frequency: r, signal: n }) {
                this.#i = r;
                let s = requestAnimationFrame,
                        i = (o) => {
                                if (this.#e && this.#r !== -1) {
                                        let a = o - this.#r,
                                                c = this.#t,
                                                l = c + a / 1e3 * this.#i,
                                                d = Math.floor(l) -
                                                        Math.floor(c);
                                        this.#t = l, t(d);
                                }
                                this.#r = o, this.#s = s(i);
                        };
                this.#s = s(i),
                        n?.addEventListener("abort", () => {
                                this.abort();
                        });
        }
        abort() {
                this.#s !== 0 && cancelAnimationFrame(this.#s);
        }
        get frequency() {
                return this.#i;
        }
        set frequency(t) {
                this.#i = t;
        }
        get disabled() {
                return !this.#e;
        }
        set disabled(t) {
                this.#e = !t;
        }
        reset() {
                this.#t = 0;
        }
};
var mr = (e) => e instanceof Error ? e.message : "Unknown error is occurred.";
var zn = () => {
        let e = f("span");
        return e.classList.add("spinner-border", "spinner-border-sm"),
                e.setAttribute("role", "status"),
                e.setAttribute("aria-hidden", "true"),
                e;
};
function Rs(e, t) {
        let r = f("input");
        r.type = "file",
                r.style.display = "none",
                e.addEventListener("click", () => {
                        r.click();
                }),
                r.addEventListener("change", () => {
                        let n = r.files;
                        if (n != null && n.length > 0) {
                                let s = n[0];
                                s != null && t(s);
                        }
                }),
                document.body.append(r);
}
var we = class {
        #t;
        constructor() {
                this.#t = [];
        }
        getFiles() {
                return this.#t.slice();
        }
        initialize() {
                se.addEventListener("click", async () => {
                        se.disabled = !0,
                                this.addFile({
                                        name: "binary.apglib",
                                        content: await fetch(
                                                "./frontend/data/binary.apglib",
                                        ).then((t) => {
                                                if (!t.ok) {
                                                        throw new Error(
                                                                "Failed to load",
                                                        );
                                                }
                                                return t.text();
                                        }),
                                        builtin: !0,
                                }),
                                await new Promise((t) => setTimeout(t, 500)),
                                ve.click();
                }),
                        Rs(Wr, async (t) => {
                                this.addFile({
                                        name: t.name,
                                        content: await t.text(),
                                }),
                                        await new Promise((r) =>
                                                setTimeout(r, 500)
                                        ),
                                        ve.click();
                        });
        }
        addFile(t) {
                this.#t.push(t);
                let r = f("td");
                r.textContent = t.name;
                let n = f("button", { text: "Delete" });
                n.className = "btn btn-danger btn-sm",
                        n.addEventListener("click", () => {
                                t.builtin && (se.disabled = !1),
                                        this.#t = this.#t.filter((o) =>
                                                o.name !== t.name
                                        ),
                                        i.remove();
                        });
                let s = f("td", { children: [n] }),
                        i = f("tr", { children: [r, s] });
                Xr.append(i);
        }
};
var As = 30,
        _e = class {
                #t;
                #r = "";
                #e;
                #i;
                #s = new Se(Ur);
                #c = new Ee(zr);
                #a = new Ne(Vr, Yr);
                $libraryUI = new we();
                #o;
                #n = "Initial";
                constructor() {
                        this.stepConfig = 1,
                                this.#o = new $e((t) => {
                                        this.run(t);
                                }, { frequency: As }),
                                this.$libraryUI.initialize();
                }
                setFrequency(t) {
                        this.#o.frequency = t, this.#u();
                }
                start() {
                        switch (this.#n) {
                                case "Initial": {
                                        this.reset() && (this.#n = "Running");
                                        break;
                                }
                                case "Stop": {
                                        this.#n = "Running";
                                        break;
                                }
                                default:
                                        throw Error("start: unreachable");
                        }
                        this.render();
                }
                stop() {
                        this.#n = "Stop", this.render();
                }
                toggle() {
                        this.#n === "Running" ? this.stop() : this.start();
                }
                #l() {
                        this.#e === void 0
                                ? this.#s.clear()
                                : this.#s.initialize(
                                        this.#e.actionExecutor.uRegMap,
                                );
                }
                #p() {
                        this.#e === void 0
                                ? this.#c.clear()
                                : this.#c.initialize(
                                        this.#e.actionExecutor.bRegMap,
                                );
                }
                #f() {
                        this.#l(), this.#p(), this.#h(), kn(Re, this.#e);
                }
                doStep() {
                        if (
                                this.#n === "Running" && this.stop(),
                                        this.stepConfig >= 5e6
                        ) {
                                let t = zn();
                                t.style.position = "absolute",
                                        v.append(t),
                                        te.style.color = "transparent",
                                        v.disabled = !0,
                                        H.disabled = !0,
                                        A.disabled = !0,
                                        setTimeout(() => {
                                                try {
                                                        this.run(
                                                                this.stepConfig,
                                                        );
                                                } finally {
                                                        te.style.color = "",
                                                                t.remove();
                                                }
                                        }, 33);
                        } else this.run(this.stepConfig);
                }
                setInputAndReset(t) {
                        z.value = t, this.reset();
                }
                reset() {
                        this.#r = "", this.#e = void 0, this.#o.reset();
                        try {
                                let t = this.$libraryUI.getFiles();
                                this.#e = Zt.fromString(z.value, t),
                                        this.#f(),
                                        this.#n = "Stop";
                        } catch (t) {
                                return this.#n = "ParseError",
                                        this.#r = mr(t),
                                        this.render(),
                                        !1;
                        }
                        return this.render(), !0;
                }
                #u() {
                        let t = this.#o.frequency;
                        this.#i !== t && (Mr.textContent = k(t), this.#i = t);
                }
                #d() {
                        try {
                                let t = this.#e?.getNextCommand();
                                kr.textContent = t?.command.pretty() ?? "";
                        } catch (t) {
                                console.error(t);
                        }
                }
                renderB2D() {
                        if (!Et.open) return;
                        let t = this.#e;
                        if (t === void 0) {
                                Tt.x.textContent = "0",
                                        Tt.y.textContent = "0",
                                        jt(Ie);
                                return;
                        }
                        let r = t.actionExecutor.b2d;
                        Tt.x.textContent = r.x.toString(),
                                Tt.y.textContent = r.y.toString();
                        let n = performance.now();
                        dr(Ie, r, vt.checked, $t.checked),
                                this.#n === "Running" &&
                                performance.now() - n >= 200 && (Et.open = !1);
                }
                renderPrinter() {
                        if (!Nt.open) return;
                        let t = this.#e;
                        if (t === void 0) {
                                It.x.textContent = "0",
                                        It.y.textContent = "0",
                                        jt(Be);
                                return;
                        }
                        let r = t.actionExecutor.matrixPrinter;
                        It.x.textContent = r.x.toString(),
                                It.y.textContent = r.y.toString();
                        let n = performance.now();
                        dr(Be, r, vt.checked, $t.checked),
                                this.#n === "Running" &&
                                performance.now() - n >= 200 && (Nt.open = !1);
                }
                renderUnary() {
                        this.#e !== void 0 && Bt.open &&
                                this.#s.render(this.#e.actionExecutor.uRegMap);
                }
                renderBinary() {
                        this.#e !== void 0 && Dt.open &&
                                this.#c.render(
                                        this.#e.actionExecutor.bRegMap,
                                        w.$hideBits.checked,
                                        w.$reverseBits.checked,
                                        w.$showBinaryValueInDecimal.checked,
                                        w.$showBinaryValueInHex.checked,
                                );
                }
                #m() {
                        let t = this.#e?.actionExecutor.output.getString();
                        Cn(Dr, t);
                }
                #h() {
                        let t = this.#e;
                        t === void 0
                                ? this.#a.clear()
                                : this.#a.initialize(
                                        t.getStateStats(),
                                        t.states,
                                );
                }
                renderStats() {
                        if (!ne.classList.contains("show")) return;
                        let t = this.#e;
                        if (t === void 0) {
                                this.#a.clear();
                                return;
                        }
                        this.#a.render(t.getStateStats(), t.currentStateIndex);
                }
                #g() {
                        switch (this.#n) {
                                case "Initial": {
                                        Wt(A),
                                                v.disabled = !1,
                                                H.disabled = !1,
                                                St.disabled = !0;
                                        break;
                                }
                                case "Stop": {
                                        Wt(A),
                                                v.disabled = !1,
                                                H.disabled = !1,
                                                St.disabled = !1;
                                        break;
                                }
                                case "Running": {
                                        An(A),
                                                v.disabled = !0,
                                                H.disabled = !0,
                                                St.disabled = !1;
                                        break;
                                }
                                case "RuntimeError":
                                case "ParseError": {
                                        Wt(A),
                                                A.disabled = !0,
                                                v.disabled = !0,
                                                H.disabled = !1,
                                                St.disabled = !0;
                                        break;
                                }
                                case "Halted": {
                                        Wt(A),
                                                A.disabled = !0,
                                                v.disabled = !0,
                                                H.disabled = !1,
                                                St.disabled = !1;
                                        break;
                                }
                        }
                }
                render() {
                        let t = this.#e, r = this.#n;
                        if (
                                this.#o.disabled = r !== "Running",
                                        this.#t !== r || r === "Stop"
                        ) {
                                this.#g(),
                                        r === "ParseError"
                                                ? z.classList.add("is-invalid")
                                                : z.classList.remove(
                                                        "is-invalid",
                                                );
                                let s = t?.analyzeResult;
                                Bt.style.display =
                                        s == null || s.unary.length === 0
                                                ? "none"
                                                : "",
                                        Dt.style.display =
                                                s == null ||
                                                        s.binary.length === 0
                                                        ? "none"
                                                        : "",
                                        Or.style.display =
                                                s?.hasAdd || s?.hasSub ||
                                                        s?.hasMul
                                                        ? ""
                                                        : "none",
                                        Et.style.display = s?.hasB2D
                                                ? ""
                                                : "none",
                                        Nt.style.display = s?.hasPrinter
                                                ? ""
                                                : "none",
                                        Br.style.display = s?.hasOutput
                                                ? ""
                                                : "none";
                        }
                        vn(Ir, r, this.#r),
                                this.#u(),
                                vr.textContent = t?.getCurrentState() ?? "",
                                Cr.textContent = t?.getPreviousOutput() ?? "",
                                Rr.textContent =
                                        t?.stepCount.toLocaleString() ?? "";
                        let n = this.stepConfig;
                        te.textContent = n === 1 ? "Step" : `${k(n)} Steps`,
                                this.#d(),
                                this.#m(),
                                this.renderUnary(),
                                this.renderBinary(),
                                Pr.textContent =
                                        t?.actionExecutor
                                                .addSubMulToUIString() ?? "",
                                this.renderB2D(),
                                this.renderPrinter(),
                                this.renderStats(),
                                this.#t = r;
                }
                run(t) {
                        switch (this.#n) {
                                case "Initial":
                                        if (!this.reset()) return;
                        }
                        if (t <= 0 || isNaN(t)) return;
                        let r = this.#e;
                        if (r === void 0) return;
                        let n = this.#n === "Running",
                                s = parseInt(Re.value, 10),
                                i = Un(Gr);
                        try {
                                let o = r.exec(t, n, s, i);
                                o !== void 0 && (this.#n = o);
                        } catch (o) {
                                this.#n = "RuntimeError", this.#r = mr(o);
                        } finally {
                                this.render();
                        }
                }
        };
var vs = "./frontend/data/", y = new _e();
H.addEventListener("click", () => {
        y.reset();
});
A.addEventListener("click", () => {
        y.toggle();
});
v.addEventListener("click", () => {
        y.doStep();
});
Fr.forEach((e) => {
        e.addEventListener("click", async () => {
                re.style.opacity = "0.5";
                let t = e.dataset.src;
                try {
                        let r = await fetch(vs + t);
                        if (!r.ok) throw Error("error");
                        y.setInputAndReset(await r.text()), Er();
                } catch (r) {
                        throw r;
                } finally {
                        re.removeAttribute("style");
                }
        });
});
Nr(Lr, y);
Et.addEventListener("toggle", () => {
        y.renderB2D();
});
Nt.addEventListener("toggle", () => {
        y.renderPrinter();
});
Dt.addEventListener("toggle", () => {
        y.renderBinary();
});
Bt.addEventListener("toggle", () => {
        y.renderUnary();
});
var Er = () => {
        z.scrollTop = 0;
};
_r(Hr, (e) => {
        y.setInputAndReset(e), Er();
});
Rt.addEventListener("input", () => {
        let e = Number(Rt.value);
        isNaN(e) || e <= 0 || !Number.isInteger(e)
                ? ($r(Rt, "Enter a positive integer"), y.stepConfig = 1)
                : (wr(Rt), y.stepConfig = e), y.render();
});
var Kt = (e, t) => {
                e.addEventListener("change", () => {
                        y.render(), xt(t, e.checked.toString());
                });
        },
        hr = "apge_hide_binary";
Kt(w.$hideBits, hr);
var gr = "apge_reverse_binary";
Kt(w.$reverseBits, gr);
var qt = "apge_show_binary_in_decimal";
Kt(w.$showBinaryValueInDecimal, qt);
var xr = "apge_show_binary_in_hex";
Kt(w.$showBinaryValueInHex, xr);
vt.addEventListener("change", () => {
        y.renderB2D(), y.renderPrinter();
});
var yr = "apge_b2d_flip_upside_down";
Kt($t, yr);
ne.addEventListener("shown.bs.modal", () => {
        y.renderStats();
});
Zr.addEventListener("click", () => {
        z.value.length >= 10 ** 6 ||
                (xt("state-diagram-input", z.value),
                        window.open(
                                "./tools/diagram/index.html",
                                void 0,
                                "noreferrer=yes,noopener=yes",
                        ));
});
var br = "apge_dark", Te = "on", Sr = "dark_mode";
At.addEventListener("change", () => {
        At.checked
                ? (xt(Sr, Te), document.body.setAttribute(br, Te))
                : (Jt(Sr), document.body.removeAttribute(br)),
                Ae.textContent = At.checked ? "On" : "Off";
        let e = "dark-mode-anim";
        document.body.classList.add(e),
                De.classList.add(e),
                setTimeout(() => {
                        document.body.classList.remove(e),
                                De.classList.remove(e);
                }, 500);
});
document.addEventListener("keydown", (e) => {
        if (
                !(Tr() || e.isComposing || e.metaKey || e.shiftKey || e.ctrlKey)
        ) {
                switch (e.code) {
                        case "Enter": {
                                y.toggle();
                                break;
                        }
                        case "Space": {
                                v.disabled || (e.preventDefault(), y.doStep());
                                break;
                        }
                }
        }
});
z.addEventListener("drop", async (e) => {
        e.preventDefault();
        let t = e.dataTransfer?.files.item(0);
        t != null && (y.setInputAndReset(await t.text()), Er());
});
re.disabled = !1;
Ar.disabled = !1;
y.render();
Qt(() => {
        let e = "initial_code", t = yt(e);
        t !== null && (Jt(e), y.setInputAndReset(t));
});
Qt(() => {
        bt("hide_binary", hr),
                bt("show_binary_in_decimal", qt),
                bt("reverse_binary", gr),
                bt("b2d_flip_upside_down", yr),
                bt("show_binary_in_hex", xr),
                yt(qt) === null && xt(qt, "true");
        let e = [
                { key: yr, checkbox: $t },
                { key: gr, checkbox: w.$reverseBits },
                { key: hr, checkbox: w.$hideBits },
                { key: qt, checkbox: w.$showBinaryValueInDecimal },
                { key: xr, checkbox: w.$showBinaryValueInHex },
        ];
        for (let { key: t, checkbox: r } of e) {
                yt(t) === "true" && (r.checked = !0);
        }
        yt(Sr) === Te &&
        (document.body.setAttribute(br, Te),
                At.checked = !0,
                Ae.textContent = "On"), y.render();
});
"serviceWorker" in navigator && Qt(async () => {
        (await navigator.serviceWorker.getRegistrations()).map((t) =>
                t.unregister()
        );
});
//# sourceMappingURL=index.dist.js.map
