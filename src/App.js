import Die from "./components/Die";
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

import "./App.css";

function App() {
  const [allDices, setAllDices] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [bestTime, setBestTIme] = useState(() => {
    const storedBestTime = localStorage.getItem('bestTime');
    return storedBestTime ? JSON.parse(storedBestTime) : null
  })

  useEffect(() => {
    const allHeld = allDices.every(dice => dice.isHeld)
    const sameValues = allDices.every(dice => dice.value)

    if(allHeld && sameValues){
      setTenzies(true)
      setIsActive(false)
      
      if(bestTime === null || seconds < bestTime){
        setBestTIme(seconds);
        localStorage.setItem("bestTime", JSON.stringify(seconds))
      }
    }
  },[allDices, seconds, bestTime])

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); 
  }, [isActive, seconds])

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
      setTenzies(false)
      setRollCount(0)
      setSeconds(0)
      setIsActive(false)
  }

  function handleRollDice() {
    setAllDices(prev => prev.map(dice => {
      return dice.isHeld === true ? dice : {...dice, value: Math.ceil(Math.random() * 6)}
    }));
    setRollCount(prev => prev + 1)
  }

  function holdDice(id) {
    setAllDices(prev => prev.map(dice => {
      if (dice.id === id) {
        if (!isActive) setIsActive(true);
        return { ...dice, isHeld: !dice.isHeld };
      } else {
        return dice;
      }
    }))
  }

  return (
    <div className="main">
      {tenzies && <Confetti />}
      <div className="stats">
        <h3>Rolls: {rollCount}</h3>
        <h3>Time: {seconds}</h3>
        <h3>Best Time: {bestTime !== null ? `${bestTime}s` : "N/A"}</h3>
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
