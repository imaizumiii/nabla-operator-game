import { BlockMath, InlineMath } from 'react-katex';
import Algebrite from 'algebrite';

export default function MathView({ expression = '', inline = false }){
    const toLatex = (s) => {
        try {
            return Algebrite.run(`printlatex(${s})`);
        } catch {
            return s;
        }
    };

    const tex = toLatex(expression);
    return inline ? <InlineMath math = {tex} /> : <BlockMath math = {tex} />;
}