import { ACTIONS } from "./App";


export default function DigitButton({styling,digit,dispatch}){
    return (
    <button
    className={styling}
    onClick = {()=>dispatch( { type: ACTIONS.ADD_DIGIT, payload: { digit } } )}
    
    >
        {digit}
    </button>);
}