const rowNum = 16, colNum = 30;
let mineNum = 99;
const gameBoard = document.getElementById('gameBoard');
class MineField{
  constructor(){
    this.field = [];

    for(let i=0; i<rowNum; i++){
      let row = [];
      for(let j=0; j<colNum; j++) row.push(0);
      this.field.push(row);
    }

    this.directions = [
      {x:-1, y:-1},
      {x: 0, y:-1},
      {x: 1, y:-1},
      {x:-1, y: 0},
      {x: 1, y: 0},
      {x:-1, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 1}
    ];
  }
  /**
   * @param {Number} firstClickedCellIdx The date
   */
  setMineField(firstClickedCellIdx){
    mineIdx = getRandomNumberArray(
      rowNum * colNum,
      mineNum,
      firstClickedCellIdx
    );
    mineIdx.forEach(idx => {
      let row = ~~(idx / colNum);
      let col = idx % colNum;
      this.field[row][col] = -1;
      this.directions.forEach(dir => {
        if(
          row + dir.y < 0 ||
          row + dir.y >= rowNum ||
          col + dir.x < 0 ||
          col + dir.x >= colNum
        ) return;
        if(this.field[row + dir.y][col + dir.x] < 0) return;
        this.field[row + dir.y][col + dir.x]++;
      });
    });
  };
}

let mineField = new MineField();

let mouseObserver = {
	left: false,
	right: false
};

let mineIdx;
let isGameStartedYet = true;

function getRandomNumberArray(range, amount, preventIdx){
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

const gameOver = () => console.log('game Over!');

/**
 * @param {Coordinate} cell
 */
const isOutOfBound = (cell, dir) => {
  return (
    cell.row + dir.y < 0 ||
    cell.row + dir.y >= colNum ||
    cell.col + dir.x < 0 ||
    cell.col + dir.x >= rowNum
  );
};
const reveal = new CustomEvent('reveal');
const simulateClick = new MouseEvent('click',{
  'view': window,
  'bubbles': true,
  'cancelable': false
});

for(let i=0; i<rowNum; i++){
	const row = document.createElement('tr');
	for(let j=0; j<colNum; j++){
		const cell = document.createElement('td');
		cell.classList.add('cell', 'pseudoAnchor');
		cell.setAttribute('row', `${i}`);
		cell.setAttribute('col', `${j}`);
    cell.addEventListener('click', ev => {
      const revealedCell = new Coordinate(
        Number(ev.target.getAttribute('row')),
        Number(ev.target.getAttribute('col'))
      );
      if(isGameStartedYet){
        mineField.setMineField(revealedCell.idx);
        isGameStartedYet = false;
      }
      console.log('clicked');
      if(mineField.field[revealedCell.row][revealedCell.col] < 0) gameOver()
      else {
        let isNoMineAround = true;
        for(const dir of mineField.directions){
          if(isOutOfBound(revealedCell, dir)) continue;
          if(mineField.field[revealedCell.row + dir.y][revealedCell.col + dir.x] < 0){
            isNoMineAround = false;
            break;
          }
        }
        if(isNoMineAround){
          for(const dir of mineField.directions){
            if(isOutOfBound(revealedCell, dir)) continue;
            const dirCell = gameBoard.querySelector(`[row='${revealedCell.row + dir.y}'][col='${revealedCell.col + dir.x}']`);
            if(dirCell.classList.contains('reveled')) continue;
            dirCell.classList.add('reveled');
            dirCell.dispatchEvent(simulateClick);
          }
        }
      }
    });
		row.appendChild(cell);
	}
	gameBoard.appendChild(row);
}

class Coordinate {
  constructor(row, col){
    this.row = row;
    this.col = col;
    this.idx = (row * colNum) + col;
  }
}