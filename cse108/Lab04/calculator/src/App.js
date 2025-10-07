import { useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {getScreen,getOp,c,add,subtract,multiply,divide, decimal, equals, number} from'./math.js';



function App() {
  const [plusButtonColor,setPlusButton]=useState("#cad2ffff");
  const [minButtonColor,setMinButton]=useState("#cad2ffff");
  const [multButtonColor,setMultButton]=useState("#cad2ffff");
  const [divButtonColor,setDivButton]=useState("#cad2ffff");
  const [screen,setScreen]=useState("0");

  const OutputField = (props) => {
    return (<Box sx={{ border: 1 , borderRadius: '5px' }} className="entry">{props.value}</Box>);
  }

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
            <td colSpan="3">
                <OutputField value={screen}/>
            </td>
            <td>
                <Button sx={{ border: 1 }} type="Button" onClick={appC} style={{backgroundColor: "rgb(255, 223, 182)"}}>C</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(7)}style={{backgroundColor: "rgb(213, 255, 210)"}}>7</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(8)}style={{backgroundColor: "rgb(213, 255, 210)"}}>8</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(9)}style={{backgroundColor: "rgb(213, 255, 210)"}}>9</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appDivide}style={{backgroundColor: divButtonColor}}>\</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(4)}style={{backgroundColor: "rgb(213, 255, 210)"}}>4</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(5)}style={{backgroundColor: "rgb(213, 255, 210)"}}>5</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(6)}style={{backgroundColor: "rgb(213, 255, 210)"}}>6</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appMultiply}style={{backgroundColor: multButtonColor}}>x</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(1)}style={{backgroundColor: "rgb(213, 255, 210)"}}>1</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(2)}style={{backgroundColor: "rgb(213, 255, 210)"}}>2</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(3)}style={{backgroundColor: "rgb(213, 255, 210)"}}>3</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appSubtract}style={{backgroundColor: minButtonColor}}>-</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={() => appNumber(0)}style={{backgroundColor: "rgb(213, 255, 210)"}}>0</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appDecimal}style={{backgroundColor: "rgb(213, 255, 210)"}}>.</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appEquals}style={{backgroundColor: "#cad2ffff"}}>=</Button>
            </td>
            <td>
                <Button sx={{ border: 1 }}type="Button" onClick={appPlus}style={{backgroundColor: plusButtonColor}}>+</Button>
            </td>
        </tr>
    </table>
    
  );
}

export default App;
