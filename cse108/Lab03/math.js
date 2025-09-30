let num1="0";
let float1=0;
let len1=0;
let num2="0";
let float2=0;
let len2=0;
let out="0";
let floatOut=0;
let lenOut=0;
//op1=+, op2=-, op3=*, op4=/
let currOp=0;
//state0= input number 1, state1=input number 2, state2=display result
let currState=0;

function update(){
    
    document.getElementById("add").style.backgroundColor = "#cad2ffff";
    document.getElementById("subtract").style.backgroundColor = "#cad2ffff";
    document.getElementById("multiply").style.backgroundColor = "#cad2ffff";
    document.getElementById("divide").style.backgroundColor = "#cad2ffff";

    if(currState==0){
        document.getElementById("output").innerHTML = num1;
    }
    if(currState==1){
        document.getElementById("output").innerHTML = num2;
    }
    if(currState==2){
        document.getElementById("output").innerHTML = out;
    }
    if(currState==1){
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
    floatOut="0";
    lenOut="0";
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
    if(currState==0 && num2!="0"){
        c();
        number(num);
    }
    
    update();
}

function decimal(){
    if(currState==0){
        if(float1==0){
            float1=1;
            num1+=".0"
            if (len1==0){
                len1=1;
            }
        }
    }
    if(currState==1){
        if(float2==0){
            float2=1;
            num2+=".0"
            if (len2==0){
                len2=1;
            }
        }
    }
    update();
}

function add(){
    if(currState==0 ){             
        currOp=1;
        currState=1;
        num2="0";
        float2=0;
        len2=0;
        console.log("add");
        update();
    }else{
        if(currState==1){
            equals(1);
        }
    }
}

function subtract(){
    if(currState==0){
        currOp=2;
        currState=1;
        num2="0";
        float2=0;
        len2=0;
        console.log("subtract"); 
        update();
    }else{
        if(currState==1){
            equals(2);
        }
    }
}

function multiply(){
    if(currState==0){        
        currOp=3;
        currState=1;
        num2="0";
        float2=0;
        len2=0;
        console.log("multiply");
        update();
    }else{
        if(currState==1){
            equals(3);
        }
    }
    
}

function divide(){
    if(currState==0){
        currOp=4;
        currState=1;
        num2="0";
        float2=0;
        len2=0;
        console.log("divide");
        update();
    }else{
        if(currState==1){
            equals(4);
        }
    }
}

function equals(newOp){
    let addend= num1;
    if(currState==1){
        addend=num1;
    }
    console.log("addend= "+addend+" Num2= "+num2);
    if(currOp!=0){
        if (currOp==1){
            out=(Number(addend)+Number(num2)).toFixed(8);
        }
        if (currOp==2){
            out=(Number(addend)-Number(num2)).toFixed(8);
        }
        if (currOp==3){
            out=(Number(addend)*Number(num2)).toFixed(8);
        }
        if (currOp==4){
            out=(Number(addend)/Number(num2)).toFixed(8);
        }
    }
    out=parseFloat(out);
    if(Number(out) % 1 !== 0){
        floatOut=1;
    }else{
        floatOut=0;
    }
    if(len1==0 && len2==0){
        lenOut=0;
    }else{
        lenOut=String(out).length;
        if(floatOut){
            lenOut--;
        }
    }
    currState=2;
    console.log("out = "+out);
    console.log("floatOut = "+floatOut);
    console.log("lenOut = "+lenOut);
    update();
    currState=1;
    if(newOp==0){
        currState=0;
    }else{
        currOp=newOp;
        num2="0";
        float2=0;
        len2=0;
    }
    num1=out;
    float1=floatOut;
    len1=lenOut;
    out="0";
    floatOut="0";
    lenOut="0";
}