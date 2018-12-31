matrix = (function () {
    function main() {
        return [
            translate('x', 'y', 'z'),
            rotateZ('pi'),
            scale('s', 's', 's')
        ]
    }

    function scale(x, y, z) {
        x = x || 1;
        y = y || x;
        z = z || y;
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ];
    }

    function translate(x, y, z) {
        x = x || 0;
        y = y || 0;
        z = z || 0;
        return [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1,
        ];
    }

    function rotateZ(angle) {
        return [
            `cos(${angle})`, `-sin(${angle})`, 0, 0,
            `sin(${angle})`, `cos(${angle})`, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    function mul(lhs, rhs) {
        return [
            dot(lhs, rhs, 0, 0), dot(lhs, rhs, 0, 1), dot(lhs, rhs, 0, 2), dot(lhs, rhs, 0, 3),
            dot(lhs, rhs, 1, 0), dot(lhs, rhs, 1, 1), dot(lhs, rhs, 1, 2), dot(lhs, rhs, 1, 3),
            dot(lhs, rhs, 2, 0), dot(lhs, rhs, 2, 1), dot(lhs, rhs, 2, 2), dot(lhs, rhs, 2, 3),
            dot(lhs, rhs, 3, 0), dot(lhs, rhs, 3, 1), dot(lhs, rhs, 3, 2), dot(lhs, rhs, 3, 3),
        ]
    }
    
    const index = (row, col) => (4 * row) + col;

    function dot(lhs, rhs, row, col) {
        return '('.concat(
            lhs[index(row, 0)], '*', rhs[index(0, col)], '+',
            lhs[index(row, 1)], '*', rhs[index(1, col)], '+',
            lhs[index(row, 2)], '*', rhs[index(2, col)], '+',
            lhs[index(row, 3)], '*', rhs[index(3, col)],
        ')')
    }

    function multiplyAll(matrices) {
        const parse = (s) => math.simplify(math.parse(s), {}, {exactFractions: true});
        const toMathJsMatrix = (m) => math.matrix([
            [ parse(m[0]),  parse(m[1]),  parse(m[2]),  parse(m[3])], 
            [ parse(m[4]),  parse(m[5]),  parse(m[6]),  parse(m[7])],
            [ parse(m[8]),  parse(m[9]), parse(m[10]), parse(m[11])],
            [parse(m[12]), parse(m[13]), parse(m[14]), parse(m[15])],
        ]);

        const texOptions = {
            parenthesis: 'auto',
            implicit: 'hide',
        };
        const ConstantNode = math.expression.node.ConstantNode;
        const OperatorNode = math.expression.node.OperatorNode;
        const constant = (v) => new ConstantNode(v);
        const multiply = (lhs, rhs) => new OperatorNode('*', 'multiply', [lhs, rhs]);
        const equal = (lhs, rhs) => new OperatorNode('=', 'equal', [lhs, rhs]);
        const line = (node) => '<div class="line">`' + node.toTex(texOptions) + '`</div>';
        
        if (matrices.length === 0) {
            return ''
        } else if (matrices.length === 1) {
            return line(constant(toMathJsMatrix(matrices[0])));
        } else {
            var lines = []
            let accumulated = matrices[matrices.length - 1];
            let accumulatedJsMatrix = toMathJsMatrix(accumulated);
            for (let i = matrices.length - 2; i >= 0; i--) {
                let result = mul(matrices[i], accumulated);
                let resultJsMatrix = toMathJsMatrix(result);

                let expression = equal(constant(resultJsMatrix), multiply(constant(toMathJsMatrix(matrices[i])), constant(accumulatedJsMatrix)));
                
                lines.push(line(expression));

                accumulated = result;
                accumulatedJsMatrix = resultJsMatrix;
            }
            return lines.join('\n');
        }
    }

    return {
        main: () => multiplyAll(main()),
    }
})();