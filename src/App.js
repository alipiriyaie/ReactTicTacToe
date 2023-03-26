import { useState } from 'react';
import './App.css';


function Square({value, onSquareClick, index}){
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  
  const winner = calculateWinner(squares);

  function handleClick(i){
    if(squares[i] != null || winner){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares);
  }

  let status;
  if(winner){
    status = "Winner: " + winner;
  }else{
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    return <Square
              value={squares[i]}
              onSquareClick={() => handleClick(i)}
              key={i}
            />;
  }

  const renderBoardRow = (start) => {
    const boardRow = [];
    for (let i = start; i < start + 3; i++) {
      boardRow.push(renderSquare(i));
    }
    return boardRow;
  }

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 9; i += 3) {
      board.push(
        <div className="board-row" key={i}>
          {renderBoardRow(i)}
        </div>
      );
    }
    return board;
  }

  return (
    <>    
      <div className='status'>{status}</div>
      {renderBoard()}
    </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [moves, setMoves] = useState([0]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMoves([...moves, currentMove + 1]);
  }



  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>You are at move #{currentMove}</div>
        {currentMove > 0 ?
          <UndoMove history={history} moves={moves} setHistory={setHistory} setCurrentMove={setCurrentMove} setMoves={setMoves}/> :
          null
        }
      </div>
    </div>
  );
}

function UndoMove({history, moves, setHistory, setCurrentMove, setMoves}){

  function handleClick(){
    const updatedHistory = history.slice(0, -1);
    setHistory(updatedHistory);
    setCurrentMove(updatedHistory.length - 1);
    setMoves(moves.slice(0, -1));
  }

  return <>
    <button onClick={handleClick}>Undo</button>
  </>
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
