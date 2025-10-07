import { useState } from "react";
import './App.css';
import {getState,getScreen,getOp,c,add,subtract,multiply,divide, decimal, equals, number} from'./math.js';



function App() {
  const [plusButtonColor,setPlusButton]=useState("#cad2ffff");
  const [minButtonColor,setMinButton]=useState("#cad2ffff");
  const [multButtonColor,setMultButton]=useState("#cad2ffff");
  const [divButtonColor,setDivButton]=useState("#cad2ffff");
  const [screen,setScreen]=useState("0");

  function appEquals(){
    equals(0);
    setScreen(getScreen);
  }
  function appDecimal(){
    decimal();
    setScreen(getScreen);
  }
  function appNumber(num){
    number(num);
    setScreen(getScreen);
  }
  function appC(){
    resetHighlights();
    c();
    setScreen(getScreen);
  }
  function resetHighlights(){
    setPlusButton("#cad2ffff");
    setMinButton("#cad2ffff");
    setMultButton("#cad2ffff");
    setDivButton("#cad2ffff");
  }
  function appPlus(){
    resetHighlights();
    add();
    if(getOp()==1){
      setPlusButton("#A6D9FF");
    }
    setScreen(getScreen);
  }
  function appSubtract(){
    resetHighlights();
    subtract();
    if(getOp()==2){
      setMinButton("#A6D9FF");
    }
    setScreen(getScreen);
  }
  function appMultiply(){
    resetHighlights();
    multiply();
    if(getOp()==3){
      setMultButton("#A6D9FF");
    }
    setScreen(getScreen);
  }
  function appDivide(){
    resetHighlights();
    divide();
    if(getOp()==4){
      setDivButton("#A6D9FF");
    }
    setScreen(getScreen);
  }
  return (
    <table>
        <tr>
            <td colspan="3">
                <div class="entry" id="output">
                    {screen}
                </div>
            </td>
            <td>
                <button type="button" onClick={appC} style={{backgroundColor: "rgb(255, 223, 182)"}}>C</button>
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" onClick={() => appNumber(7)}>7</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(8)}>8</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(9)}>9</button>
            </td>
            <td>
                <button type="button" onClick={appDivide}style={{backgroundColor: divButtonColor}}>\</button>
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" onClick={() => appNumber(4)}>4</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(5)}>5</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(6)}>6</button>
            </td>
            <td>
                <button type="button" onClick={appMultiply}style={{backgroundColor: multButtonColor}}>x</button>
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" onClick={() => appNumber(1)}>1</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(2)}>2</button>
            </td>
            <td>
                <button type="button" onClick={() => appNumber(3)}>3</button>
            </td>
            <td>
                <button type="button" onClick={appSubtract}style={{backgroundColor: minButtonColor}}>-</button>
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" onClick={() => appNumber(0)}>0</button>
            </td>
            <td>
                <button type="button" onClick={appDecimal}>.</button>
            </td>
            <td>
                <button type="button" onClick={appEquals}style={{backgroundColor: "#cad2ffff"}}>=</button>
            </td>
            <td>
                <button type="button" onClick={appPlus}style={{backgroundColor: plusButtonColor}}>+</button>
            </td>
        </tr>
    </table>
  );
}

export default App;
