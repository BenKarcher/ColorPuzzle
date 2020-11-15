const colors = ["white","blue","purple","green","cyan","red","orange"];
const tiles = [];
const checks = [];
const colorSelectors =[];
let selectedColor=1;

function cycle(div,event){
  if(event.button==2){
    div.color=0;
    if(div.style["background-color"]=="lightgrey"){
      div.style["background-color"]="white";
    }else{
      div.style["background-color"]="lightgrey";
    }
  }else{
    div.color=selectedColor;
    if(div.style["background-color"]==colors[selectedColor]){
      div.style["background-color"]="white";
    }else{
      div.style["background-color"]=colors[selectedColor];
    }
  }
  event.preventDefault(true);
  for(let div of checks){
    div.style["background-color"]=div.check()?"lightgreen":"lightcoral";
  }
}

function filter(color){
  return tiles.map((row)=>row.map((tile)=>tile.color===color));
}

function getpoints(color){
  return tiles.flat().filter((tile)=>tile.color===color);
}

function setColor(color){
  for(let div of colorSelectors)
    div.style.border="";
  colorSelectors[color].style.border="solid black";
  selectedColor=color;
  return 0;
}

window.onload = function () {

  //make the board
  const content = document.getElementById("content");
  for (let i = 0; i < 6; i++) {
    let row=[];
    for (let j = 0; j < 6; j++) {
      let div=document.createElement("div");
      div.className="tile";
      div.color=0;
      div.x=j;
      div.y=i;
      div.onmousedown=cycle.bind(null,div);
      div.addEventListener('contextmenu', function(evt) { 
        evt.preventDefault();
      }, false);
      content.appendChild(div);
      row.push(div);
    }
    tiles.push(row);
  }

  //make C5 blue
  tiles[4][2].color=1;
  tiles[4][2].style["background-color"]=colors[1];
  tiles[4][2].onmousedown=null;

  //make conditions
  const conditions=document.getElementById("conditions");
  for(let clue of clues){
    let div=document.createElement("div");
    div.className="clue";  
    div.innerHTML=clue.description;
    let details = document.createElement("span");
    details.innerHTML=clue.details;
    details.className="details";
    div.appendChild(details);
    conditions.appendChild(div);
    div.check=clue.check;
    //div.onclick=check.bind(null,div,clue.check);
    checks.push(div);
  }

  const colorPicker=document.getElementById("colorPicker");
  for(let color in colors){
    let div=document.createElement("div");
    div.className="colors";
    div.style["background-color"]=colors[color];
    colorPicker.appendChild(div);
    div.onmousedown=setColor.bind(null,color);
    colorSelectors.push(div);
  }

  for(let div of checks){
    div.style["background-color"]=div.check()?"lightgreen":"lightcoral";
  }
  setColor(1);
  document.onkeydown=function(e){
    let color=parseInt(e.key)
    if(color && color >=1 && color<=7)
      setColor(parseInt(e.key)-1);
  }
};
