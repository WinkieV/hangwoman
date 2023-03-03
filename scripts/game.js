"use strict"

const womanFlyIds = [ 'woman-fly1', 'woman-fly2' ]; // post-win woman animation steps
const signWinId = 'woman-winner'; // woman with win sign
const signLostId = 'sign-lost'; // lost sign
const signReplayId = 'replay'; // replay button
const womanIds = ['right-leg', 'left-leg', 'lower-body', 'upper-body', 'neck', 'head', 'left-arm', 'right-arm', 'kite']; // woman steps
const alphabetId = 'alphabet';

// word to guess
const wordsAll = ['coconut', 'jungle', 'mountain', 'sunshine', 'island', 'tradition', 'volcano', 'rainforest', 'banana', 'monkey', 'monsoon', 'kitesurfing', 'lizard', 'mosquito', 'pineapple', 'octopus', 'canoe', 'hammock', 'bikini', 'dolphin'];
let wordsCurrent = wordsAll.slice();
let word = '', wordProgress = [];

let lettersGuessed = "";
let wrongGuessCount = 0;
let rightGuessCount = 0;

// initialize for start phase
function initialize() {
  // set handler: guess for click
  document.getElementById(alphabetId).addEventListener('click', (e) => {
    const letter = e.target.innerText;
    if (letter.length === 1)
      processGuess(letter);
  });

  // set handler: guess for keyboard
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && document.getElementById(signReplayId).getAttribute('visibility') !== 'hidden') // play again?
      reset();
    else if (e.key.length === 1) // regular key?
      processGuess(e.key);
  });

  // set handler: play again clicked
  document.getElementById(signReplayId).addEventListener('click', reset);

  // reset prior to 1st play
  reset();
}

// reset
function reset() {
  // hide woman
  for (const id of womanIds)
    document.getElementById(id).setAttribute('visibility', 'hidden');
  // hide post-win woman animation
  for (const id of womanFlyIds)
    document.getElementById(id).setAttribute('visibility', 'hidden');
  // reset and hide woman win sign jumping
  document.getElementById(signWinId).classList.remove('womanJumping');
  document.getElementById(signWinId).setAttribute('visibility', 'hidden');
  // reset and hide lost sign animation
  document.getElementById(signLostId).classList.remove('scalingLostSign');
  document.getElementById(signLostId).setAttribute('visibility', 'hidden');
  // hide replay button
  document.getElementById(signReplayId).setAttribute('visibility', 'hidden');
  // reset disappear woman animation
  document.getElementById(womanFlyIds[1]).classList.remove('womanDisappear'); 

  // remove grayed out keyboard letters and correct word
  const lettersSelected = document.querySelectorAll('.letters-selected');
  for (const letter of lettersSelected)
    letter.classList.remove('letters-selected');

  const wordGrayedOut = document.getElementById('answer');
  wordGrayedOut.classList.remove('wordguess-exposed');

  // pick word to guess
  if (wordsCurrent.length === 0) // used up all words?
    wordsCurrent = wordsAll.slice();
  const wordIndex = Math.floor(Math.random() * wordsCurrent.length);
  word = wordsCurrent[wordIndex];

  // clean up words list for next game
  wordsCurrent[wordIndex] = wordsCurrent[wordsCurrent.length - 1];
  wordsCurrent.pop();

  // initialize word to guess
  wordProgress = [];
  for (let i = 0; i < word.length; i++)
    wordProgress[i] = '*';
  document.getElementById('answer').innerText = wordProgress.join('');

  // no guesses yet
  lettersGuessed = '';
  wrongGuessCount = 0;
  rightGuessCount = 0;
}

function processGuess(letter) {
  // too many guesses?
  if (wrongGuessCount === womanIds.length || rightGuessCount === word.length)
    return;

  const letterLower = letter.toLowerCase();
  // invalid letter?
  if ( !('a' <= letterLower && letterLower <= 'z'))
    return;
  
  // already guessed?
  if (lettersGuessed.includes(letterLower))
    return;

  let correctGuess = false;
  // check if word contains letter
  for (let i = 0; i < word.length; i++) {
    if (word[i] == letterLower) {
      wordProgress[i] = letterLower;
      correctGuess = true;
      rightGuessCount++;
    }      
  }

  if (correctGuess) {
    document.getElementById('answer').innerText = wordProgress.join('');
  } else {
    document.getElementById(womanIds[wrongGuessCount]).setAttribute('visibility', 'visible');
    wrongGuessCount++;
  }

  lettersGuessed += letterLower;

  // show chosen letter as "selected"
  let letterElem = document.querySelector(`div .letters p[data-letter="${letterLower}"]`);
  letterElem.classList.add('letters-selected');

  // word fully guessed?
  if (rightGuessCount === word.length) {
    // hide woman
    for (const id of womanIds)
      document.getElementById(id).setAttribute('visibility', 'hidden');

    // show woman win sign jumping
    document.getElementById(signWinId).setAttribute('visibility', 'visible');
    document.getElementById(signWinId).classList.add('womanJumping');

    // play win sound
    const winSound = new Audio('sounds/cheering.ogg');
    winSound.play();

    // play again?
    setTimeout(playAgain, 2700, signWinId);
  }

  // out of guesses?
  if (wrongGuessCount === womanIds.length) {
    // expose word
    const showWord = document.getElementById('answer');
    showWord.innerText = word;
    showWord.classList.add('wordguess-exposed');

    setTimeout(loseAnimationFly1, 800);
  }
}

function loseAnimationFly1() {
  // hide woman
  for (const id of womanIds)
    document.getElementById(id).setAttribute('visibility', 'hidden');
  
  // show woman flying step 1
  document.getElementById(womanFlyIds[0]).setAttribute('visibility', 'visible');
  
  setTimeout(loseAnimationFly2, 200);  
}

function loseAnimationFly2() {
  // hide woman flying step 1
  document.getElementById(womanFlyIds[0]).setAttribute('visibility', 'hidden');

  // show woman flying step 2
  document.getElementById(womanFlyIds[1]).setAttribute('visibility', 'visible');

  // play lose sound
  const loseSound = new Audio('sounds/nooo.ogg');
  loseSound.play();

  setTimeout(loseAnimationFly3, 300);  
}

function loseAnimationFly3() {
  // woman fly out of screen
  document.getElementById(womanFlyIds[1]).classList.add('womanDisappear');

  setTimeout(showLoseSign, 1200);
}

function showLoseSign() {
  // show lose sign
  document.getElementById(signLostId).setAttribute('visibility', 'visible');
  document.getElementById(signLostId).classList.add('scalingLostSign');

  // play again?
  setTimeout(playAgain, 2700, signLostId);
}

function playAgain(id) {
  document.getElementById(id).setAttribute('visibility', 'hidden');
  document.getElementById(signReplayId).setAttribute('visibility', 'visible');
}