// import myJson from '../data/words.json' with {type: 'json'};
import {words} from '../data/words.js'

console.log(words);

let board;
const height = 6;
const width = 5;

// player current position
let rowPlayer = 0;
let columnPlayer = 0;

var gameOver = false;
// var word = "SQUID";
var word = words[Math.floor(Math.random() * words.length)].toUpperCase();



window.onload = function() {
  initialize();
}

function processInput(e) {
  if (gameOver) return;
  
  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (columnPlayer < width) {
      let currentTile = document.getElementById(rowPlayer.toString() + "-" + columnPlayer.toString());
      if (currentTile.innerText == "") {
        currentTile.innerText = e.code[3];
        columnPlayer += 1;
      }
    }
  }
  else if (e.code == "Backspace") {
    if (0 < columnPlayer && columnPlayer <= width) {
      columnPlayer -= 1;
    }
    let currentTile = document.getElementById(rowPlayer.toString() + "-" + columnPlayer.toString());
    currentTile.innerText = "";
  }
  else if (e.code == "Enter" && columnPlayer == width) {
    // after letter press position is on sixth tile (0,5)
    update();
  }
  if (!gameOver && rowPlayer == height) {
    gameOver = true;
    document.getElementById("answer").innerText = word;
  }
}
  



function initialize() {

  // create board
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      tile.innerText = "";
      document.getElementById("board").appendChild(tile);
    }
  }

  // create keyboard 
  let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
  ];

  for (let i = 0; i < keyboard.length; i++) {
    let currentRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");
    for (let j = 0; j < currentRow.length; j++) {
      let key = currentRow[j];
      let keyTile = document.createElement("div");
      keyTile.innerText = key;
      if (key == "Enter") {
        keyTile.id = "Enter";
      }
      else if (key == "⌫") {
        keyTile.id = "Backspace";
      }
      else if ("A" <= key && key <= "Z") {
        keyTile.id = "Key" + key;
      }
      keyTile.addEventListener("click", processKey);
      if (key == "Enter") {
        keyTile.classList.add("enter-keytile");
      } else {
        keyTile.classList.add("keytile");
      }
      keyboardRow.appendChild(keyTile);
    }
    document.getElementById("keyboard").appendChild(keyboardRow);
  }
  // Listen for key press
  document.addEventListener("keydown", (e) => {
    processInput(e);
  });
}

function processKey() {
  let e = {"code": this.id};
  processInput(e);
}

function update() {

  let guess = "";
  document.getElementById("answer").innerText = "";
  
  //string up the guess word
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(rowPlayer.toString() + "-" + c.toString());
    let letter = currentTile.innerText;
    guess += letter;
  }

  guess = guess.toLowerCase();
  if (!words.includes(guess)) {
    document.getElementById("answer").innerText = "Invalid word!";
    return;
  }

  // start processing game
  let correct = 0;
  let letterCount = {};
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (letterCount[letter]) {
      letterCount[letter] += 1;
    }
    else {
      letterCount[letter] = 1;
    }
  }


  // first iteration, check all correct ones
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(rowPlayer.toString() + "-" + c.toString());
    let letter = currentTile.innerText;

    //check for right position
    if (word[c] == letter) {
      currentTile.classList.add("correct");

      let keyTile = document.getElementById("Key" + letter);
      keyTile.classList.remove("present");
      keyTile.classList.add("correct");
      correct += 1;
      letterCount[letter] -= 1;
    }
    if (!word.includes(letter)) {
      let keyTile = document.getElementById("Key" + letter);
      keyTile.classList.add("absent");

    }

    if (correct == width) {
      gameOver = true;
    }
  }


  // mark which are in wrong position
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(rowPlayer.toString() + "-" + c.toString());
    let letter = currentTile.innerText;

    if (!currentTile.classList.contains("correct")) {
      if (word.includes(letter) && letterCount[letter] > 0 ) {
        currentTile.classList.add("present");
        
        
        let keyTile = document.getElementById("Key" + letter);
        if (!keyTile.classList.contains("correct")) {
          keyTile.classList.add("present");
          
        }
        
        letterCount[letter] -= 1;

      } // not in the word
      else {
        currentTile.classList.add("absent");
      }
    }
  }
  rowPlayer += 1;
  columnPlayer = 0;

}