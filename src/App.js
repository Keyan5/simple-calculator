import { useEffect,useReducer } from "react";
import DigitButton from "./DigitButton";
import OperatorButton from "./OperatorButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-operation",
  CLEAR: "clear",
  EVALUATE: "evaluate",
}

const reducer = (state, { type, payload }) => {

  switch(type)
  {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      if(payload.digit === '0' && state.currentOperand === '0')
        return state;
      if(payload.digit === '.' && state.currentOperand.includes('.'))
        return state;
      return { ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}` };
    case ACTIONS.CHOOSE_OPERATION:
      if(state.prevOperand == null && state.currentOperand == null)
        return state
      if(state.currentOperand == null)
        return { 
          ...state, 
          operator: payload.operator
      }
      if(state.prevOperand == null)
        return { 
          ...state, 
          operator: payload.operator,
          prevOperand: state.currentOperand, 
          currentOperand: null 
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operator: payload.operator,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if(state.prevOperand == null || state.currentOperand == null || state.operator == null)
        return state;
      return {
        ...state,
        operator : null,
        overwrite: true,
        prevOperand: null,
        currentOperand: evaluate(state)
      };
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite)
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
        if(state.currentOperand == null) return state;
        if(state.currentOperand.length === 1) 
          return {
            ...state,
            currentOperand: null
          };
      return { ...state,currentOperand:state.currentOperand.slice(0,-1) };
    default:
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
} );

function formatOperand(operand) {
  if(operand==null) return;
  const [integer,decimal] = String(operand).split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate ({ currentOperand, prevOperand, operator }){
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currentOperand);
  if( isNaN(prev) || isNaN(curr) )
    return "";
  let result = "";
  switch(operator)
  {
    case '+':
        result = prev+curr;
        break;
    case '-':
        result = prev-curr;
        break;
    case '*':
      result = prev*curr;
      break;
    case '÷':
      result = prev/curr;
      break;
    default:
  }
  return result.toString();
}  


function App() {

  const [{ currentOperand, prevOperand, operator },dispatch] = useReducer(reducer,{});

  const box_border = "box-border border-2  border-black font-bold text-lg bg-white bg-opacity-75 hover:bg-opacity-90 focus:bg-opacity-90 ";

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      console.log(key);
      if (key === "Backspace" || key === "Delete") {
        dispatch({ type: ACTIONS.DELETE_DIGIT });
        return;
      }

      const digit = parseInt(key);
      
      if (!isNaN(digit)) 
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
      else if (key === "+" || key === "-" || key === "*" || key === "/")
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operator: key } });
      else if (key === "=" || key === "Enter")
        dispatch({ type: ACTIONS.EVALUATE });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <div style={{width:400}}>
    <div className='p-5 w-full min-h-screen  cursor-pointer grid gap-0 grid-cols-4  ' >
      <div className={"rounded-t-xl flex flex-col items-end justify-around bg-opacity-75 bg-black col-span-4 row-span-2 "}>
        <div className='text-gray-100 text-xl px-2 break-words break-all '>{formatOperand(prevOperand)} {operator}</div>
        <div className='text-white text-4xl px-2 break-words break-all '>{formatOperand(currentOperand)}</div>
      </div> 
      <button className={box_border+'col-span-2'} onClick = {()=>dispatch( { type:ACTIONS.CLEAR } )} >AC</button> 
      <button className={box_border+''} onClick={()=>dispatch( {type: ACTIONS.DELETE_DIGIT} )} >DEL</button> 
      <OperatorButton styling={box_border}  operator={'÷'} dispatch={dispatch} />
      <DigitButton styling={box_border} digit={'1'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'2'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'3'} dispatch={dispatch}/>
      <OperatorButton styling={box_border} operator={'*'} dispatch={dispatch} />
      <DigitButton styling={box_border} digit={'4'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'5'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'6'} dispatch={dispatch}/>
      <OperatorButton styling={box_border} operator={'+'} dispatch={dispatch} />
      <DigitButton styling={box_border} digit={'7'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'8'} dispatch={dispatch}/>
      <DigitButton styling={box_border} digit={'9'} dispatch={dispatch}/>
      <OperatorButton styling={box_border} operator={'-'} dispatch={dispatch} />
      <DigitButton styling={box_border+" rounded-bl-xl "}  digit={'.'} dispatch={dispatch} />
      <DigitButton styling={box_border} digit={'0'} dispatch={dispatch}/>
      <button className={box_border+' col-span-2 rounded-br-xl '} onClick={()=>dispatch({ type: ACTIONS.EVALUATE })} >=</button> 
    </div>
    </div>
  );
}

export default App;
