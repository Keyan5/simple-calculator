import { ACTIONS } from "./App";
import "./output.css";


export default function OperationButton({styling,operator,dispatch}){
    return (
    <button
    className={styling}
    onClick = {()=>dispatch( { type: ACTIONS.CHOOSE_OPERATION, payload: { operator } } ) }
    >
        {operator}
    </button>);
}