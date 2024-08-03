import Die from "./components/Die";
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

import "./App.css";

function App() {
  const [allDices, setAllDices] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)

  useEffect(() => {
    const allHeld = allDices.every(dice => dice.isHeld)
    const sameValues = allDices.every(dice => dice.value)

    setTenzies(allHeld && sameValues ? true : false )
    console.log("You won!")
  },[allDices])

  console.log(tenzies)

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      });
    }
    return newDice;
  }

  function handleNewGame(){
      setAllDices(allNewDice())
  }

  function handleRollDice() {
    setAllDices(prev => prev.map(dice => {
      return dice.isHeld === true ? dice : {...dice, value: Math.ceil(Math.random() * 6)}
    }));
    setRollCount(prev => prev + 1)
  }

  function holdDice(id) {
    setAllDices(prev => prev.map(dice => {
      return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
    }))
  }

  return (
    <div className="main">
      {tenzies && <Confetti />}
      <div>
        <h3>Rolls: {rollCount}</h3>
        <h3>Time</h3>
        <h3>Best Time:</h3>
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="container">
        {allDices.map((dice) => {
          return (
            <Die
              isHeld={dice.isHeld}
              key={dice.id}
              value={dice.value}
              onHold={() => holdDice(dice.id)}
            />
          );
        })}
      </div>
      <button onClick={ tenzies === false ? handleRollDice : handleNewGame} className="roll-btn">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </div>
  );
}

export default App;
