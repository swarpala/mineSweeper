const rowNum = 16, colNum = 30;
let mineNum = 99;
const gameBoard = document.getElementById('gameBoard');

let mouseObserver = {
	left: false,
	right: false
};
let isGameStarted = false;

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

for(let i=0; i<rowNum; i++){
	const row = document.createElement('tr');
	row.setAttribute('num', `${i}`);
	for(let j=0; j<colNum; j++){
		const cell = document.createElement('td');
		cell.classList.add('cell', 'pseudoAnchor');
		cell.setAttribute('num', `${j}`);
		row.appendChild(cell);
	}
	gameBoard.appendChild(row);
}

const reveal = new CustomEvent('reveal');