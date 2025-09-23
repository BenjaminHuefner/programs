let num1="0";
let float1=0;
let len1=0;
let num2="0";
let float2=0;
let len2=0;
let out="0";
//op1=+, op2=-, op3=*, op4=/
let currOp=0;
//state0= input number 1, state1=input number 2, state2=display result
let currState=0;

function update(){
    
    document.getElementById("add").style.backgroundColor = "#EDEDED";
    document.getElementById("subtract").style.backgroundColor = "#EDEDED";
    document.getElementById("multiply").style.backgroundColor = "#EDEDED";
    document.getElementById("divide").style.backgroundColor = "#EDEDED";

    if(currState==0){
        document.getElementById("output").innerHTML = num1;
    }
    if(currState==1){
        document.getElementById("output").innerHTML = num2;
    }
    if(currState==2){
        document.getElementById("output").innerHTML = out;
    }
    if(currOp==1){
        document.getElementById("add").style.backgroundColor = "#A6D9FF";
    }
    if(currOp==2){
        document.getElementById("subtract").style.backgroundColor = "#A6D9FF";
    }
    if(currOp==3){
        document.getElementById("multiply").style.backgroundColor = "#A6D9FF";
    }
    if(currOp==4){
        document.getElementById("divide").style.backgroundColor = "#A6D9FF";
    }
    console.log("updating");
}

function c(){
    currState=0;
    currOp=0;
    num1="0";
    float1=0;
    len1=0;
    num2="0";
    float2=0;
    len2=0;
    out="0";
    console.log("cleared");
    update();
}
function number(num){
    console.log(String(num)+" clicked");
    if(currState==0 && len1<10){
        if (len1==0){
            num1=String(num);
            if(num1=="0"){
                return;
            }
        }else{
            if(float1==1 &&num1[num1.length-1]==0){
                num1=num1.slice(0,num1.length-1);
                float1=2;
            }
            num1+=String(num);
        }
        len1++;
        console.log("num1 = "+num1);
    }
    if(currState==1 && len2<10){
        if (len2==0){
            num2=String(num);
            if(num2=="0"){
                return;
            }
        }else{
            if(float2==1 &&num2[num2.length-1]==0){
                num2=num2.slice(0,num2.length-1);
                float2=2;
            }
            num2+=String(num);
        }
        len2++;
        console.log("num2 = "+num2);
    }
    
    update();
}

function decimal(){
    if(currState==0){
        if(float1==0){
            float1=1;
            num1+=".0"
        }
    }
    if(currState==1){
        if(float2==0){
            float2=1;
            num2+=".0"
        }
    }
    update();
}

function add(){
    if(currState==0 || currState==1){
        currOp=1;
        currState=1;
        console.log("add");
    }
    update();
}

function subtract(){
    if(currState==0 || currState==1){
        currOp=2;
        currState=1;
        console.log("subtract"); 
    }
    update();
}

function multiply(){
    if(currState==0 || currState==1){
        currOp=3;
        currState=1;
        console.log("multiply");
    }
    
    update();
}

function divide(){
    if(currState==0 || currState==1){
        currOp=4;
        currState=1;
        console.log("divide");
    }
    update();
}

function equals(){
    if(currState==1){
        if (currOp==1){
            out=(Number(num1)+Number(num2)).toFixed(8);
        }
        if (currOp==2){
            out=(Number(num1)-Number(num2)).toFixed(8);
        }
        if (currOp==3){
            out=(Number(num1)*Number(num2)).toFixed(8);
        }
        if (currOp==4){
            out=(Number(num1)/Number(num2)).toFixed(8);
        }
        out=parseFloat(out);
        currState=2;
        console.log("out = "+out);
    }
    update();
}