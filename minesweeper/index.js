const rowNum = 16, colNum = 30;
let mineNum = 99;
const gameBoard = document.getElementById('gameBoard');
let gameArray = [];
/* todo
  gameArray Classify
    constructor
      array
      directions
    method setGameArray(array)
*/
for(let i=0; i<rowNum; i++){
  let row = [];
  for(let j=0; j<colNum; j++) row.push(0);
  gameArray.push(row);
}

let mouseObserver = {
	left: false,
	right: false
};

const directions = [
  {x:-1, y:-1},
  {x: 0, y:-1},
  {x: 1, y:-1},
  {x:-1, y: 0},
  {x: 1, y: 0},
  {x:-1, y: 1},
  {x: 0, y: 1},
  {x: 1, y: 1}
];

let mineIdx;
let isGameStartedYet = true;

function getRandomNumberArray(range, amount, preventIdx){
	debugger;
	let selectedArray = [];
	while(selectedArray.length < amount){
		let tmp = ~~(Math.random() * range);
		if(selectedArray.includes(tmp) || tmp === preventIdx) continue;
		selectedArray.push(tmp);
	}
	return selectedArray;
}

const remain = document.getElementById('remain');
remain.innerText = `remains: ${mineNum}`;

const restart = document.getElementById('restart');

restart.addEventListener('mouseenter',()=>{
	restart.innerText = '🤔';
});
restart.addEventListener('mouseleave',()=>{
	restart.innerText = '🙂';
});

// gameBoard click prevent & click observer event setting start---

gameBoard.addEventListener('contextmenu', ev => ev.preventDefault());
gameBoard.addEventListener('mousedown', ev => {
	var isRightButton;
    ev = ev || window.event;

    if ("which" in ev)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightButton = ev.which == 3; 
    else if ("button" in ev)  // IE, Opera 
        isRightButton = ev.button == 2; 

    if(isRightButton) mouseObserver.right = true;
    else mouseObserver.left = true;
});
gameBoard.addEventListener('mouseup', ev => {
	var isRightButton;
    ev = ev || window.event;

    if ("which" in ev)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightButton = ev.which == 3; 
    else if ("button" in ev)  // IE, Opera 
        isRightButton = ev.button == 2; 

    if(isRightButton) mouseObserver.right = false;
    else mouseObserver.left = false;
});

// gameBoard click prevent & click observer event setting end---

const gameOver = () => {
  console.log('game Over!')
};

for(let i=0; i<rowNum; i++){
	const row = document.createElement('tr');
	for(let j=0; j<colNum; j++){
		const cell = document.createElement('td');
		cell.classList.add('cell', 'pseudoAnchor');
		cell.setAttribute('row', `${i}`);
		cell.setAttribute('col', `${j}`);
    cell.addEventListener('click', ev => {
      const revealedCoordinate = new Coordinate(
        Number(ev.target.getAttribute('row')),
        Number(ev.target.getAttribute('col'))
      );
      if(isGameStartedYet){
        mineIdx = getRandomNumberArray(
          rowNum * colNum,
          mineNum,
          revealedCoordinate.idx
        );
        isGameStartedYet = false;
        mineIdx.forEach(idx => {
          let row = ~~(idx / colNum);
          let col = idx % colNum;
          gameArray[row][col] = -1;
          directions.forEach(item => {
            if(
              row + item.y < 0 ||
              row + item.y >= rowNum ||
              col + item.x < 0 ||
              col + item.x >= colNum
            ) return;
            if(gameArray[row + item.y][col + item.x] < 0) return;
            gameArray[row + item.y][col + item.x]++;
          })
        })
      }
      if(gameArray[revealedCoordinate.row][revealedCoordinate.col] < 0) gameOver();
      
    });
		row.appendChild(cell);
	}
	gameBoard.appendChild(row);
}

const reveal = new CustomEvent('reveal');

class Coordinate {
  constructor(row, col){
    this.row = row;
    this.col = col;
    this.idx = (row * colNum) + col;
  }
}