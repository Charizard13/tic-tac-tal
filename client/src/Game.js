import React, { useReducer, useState, useEffect } from "react";
import Board from "./Board";
import ModalComponent from "./ModalComponent";
import Button from 'react-bootstrap/Button';

const axios = require("axios");



function Game(props) {
  const [listWinner, setWinnerList] = useState([]);

  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);

  const [stepNumber, setStepNumber] = useState(0);
  // const [gameTimer, setGameTimer] = useState(0);
  // const [isTimerOn, setTimer] = useState(true);


  // useEffect(() => {
  //   if (isTimerOn) {
  //     setTimeout(function () {
  //       setGameTimer(gameTimer + 1);
  //     }, 1000);
  //   }
  // }, [gameTimer]);

  const [xIsNext, setXIsNext] = useState(true);

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  function handleClick(i) {
    const historyBook = history.slice(0, stepNumber + 1);
    const current = historyBook[historyBook.length - 1];

    const squares = current.squares.slice(); // example: ["X", "O", null, null, null, null, null, null, null]
    if (calculateWinner(squares) || squares[i]) {
      // ignore click if game is won or if squares[i] is already taken
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    // Before: [{squares: ["X", "O", null, null, null, null, null, null, null]}]
    setHistory(history.concat([{ squares: squares }]));
    // history: [...history, {squares}],
    setStepNumber(history.length);

    setXIsNext(!xIsNext);

    // After: [{squares: ["X", "O", null, null, null, null, null, null, null]}, {squares: ["X", "O", "X", null, null, null, null, null, null]]
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  async function winnerList() {
    const { data } = await axios.get("/api/v1/records/");
    console.log(data);
    setWinnerList(data);
  }

  function resetWinnerList() {
    axios.delete("/api/v1/records/");
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    // isTimerOn = false;
    status = "Winner: " + winner; //+ gameTimer
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        <button onClick={winnerList} className="button" color="primary"> winner's board</button>
        <button onClick={resetWinnerList} className="btn" color="warning">Reset score</button>
        <div>
          {listWinner.map((winner, i) => {
            return <div key={i}>{winner.name}</div>;
          })}
        </div>
        {winner && <ModalComponent />}
      </div>
    </div>
  );
}

export default Game;
