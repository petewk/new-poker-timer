
import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  const [rounds, setRounds] = useState(1);
  const [roundsArray, setRoundsArray] = useState(Array.from({length: rounds}, (_, i) => i + 1));
  const [roundTimesMS, setRoundTimesMS] = useState([]);
  const [smallBlinds, setSmallBlinds] = useState([]);
  const [bigBlinds, setBigBlinds] = useState([]);
  const [totalTimeMS, setTotalTimeMS] = useState();
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(0);
  const [paused, setPaused] = useState(true);
  const [testNum, setTestNum] = useState(1);

  useEffect(()=>{

    setRoundsArray(Array.from({length: rounds}, (_, i) => i + 1));



    const intervalID = setInterval(()=>{
      countDown();
  }, 1000);
    return () => clearInterval(intervalID);
  }, [rounds, roundTimeRemaining, paused])

  function roundsUp(){
    let target = document.getElementById("numRounds")
    target.value++;
    setRounds(target.value)
  };

  function roundsDown(){
    let target = document.getElementById("numRounds")
    target.value--;
    setRounds(target.value)
  }

  function setNumRounds(e){
    setRounds(e.target.value)
  }

//   ###                               ######                       
//   #  #    # #####  #    # #####    #     #  ####  #    #  ####  
//   #  ##   # #    # #    #   #      #     # #    # #    # #      
//   #  # #  # #    # #    #   #      ######  #    # #    #  ####  
//   #  #  # # #####  #    #   #      #   #   #    # # ## #      # 
//   #  #   ## #      #    #   #      #    #  #    # ##  ## #    # 
//  ### #    # #       ####    #      #     #  ####  #    #  ####

  function adjustTimes(){
    let timeInputs = Array.from(document.getElementsByClassName('roundTimes'));
    let tempArr = [];
    timeInputs.forEach((item)=>{
      tempArr.push(parseInt(item.value * 60000))
    });
    setRoundTimesMS(tempArr);

    let totalTimetemp = tempArr.reduce((a, b)=>{
      console.log(a, b);
      return a + b

    }, 0);
    setTotalTimeMS(totalTimetemp);
  };

  function adjustSmallBlinds(){
    let smallInputs = Array.from(document.getElementsByClassName('smallBlinds'));
    let tempArr = [];
    smallInputs.forEach((item)=>{
      tempArr.push(item.value)
    });
    setSmallBlinds(tempArr)
    console.log(smallBlinds)
  };

  function adjustBigBlinds(){
    let bigInputs = Array.from(document.getElementsByClassName('bigBlinds'));
    let tempArr = [];
    bigInputs.forEach((item)=>{
      tempArr.push(item.value)
    });
    setBigBlinds(tempArr);
    console.log(bigBlinds)
  };


//   #####                                                              ##       ######                                     
//  #     #  ####  #    # #    # ##### #####   ####  #    # #    #     #  #      #     #  ####  #    # #    # #####   ####  
//  #       #    # #    # ##   #   #   #    # #    # #    # ##   #      ##       #     # #    # #    # ##   # #    # #      
//  #       #    # #    # # #  #   #   #    # #    # #    # # #  #     ###       ######  #    # #    # # #  # #    #  ####  
//  #       #    # #    # #  # #   #   #    # #    # # ## # #  # #    #   # #    #   #   #    # #    # #  # # #    #      # 
//  #     # #    # #    # #   ##   #   #    # #    # ##  ## #   ##    #    #     #    #  #    # #    # #   ## #    # #    # 
//   #####   ####   ####  #    #   #   #####   ####  #    # #    #     ###  #    #     #  ####   ####  #    # #####   ####  
                                                                                                                         

  function startTimer(){

    if(bigBlinds.length === parseInt(rounds) && smallBlinds.length === parseInt(rounds) && roundTimesMS.length === parseInt(rounds)){
      setPaused(!paused);
      setRoundTimeRemaining(roundTimesMS[currentRound - 1]);
      const button = document.getElementById('startButton');
      button.classList.add('hidden');
    } else {
      window.alert("Looks like you have a gap in your table, please ensure all rounds have a Time and both Blinds filled out")
    }
    
  }

  function countDown(){
    if(paused === false) {
      if(roundTimeRemaining === 0){
        if(currentRound === parseInt(rounds)){
          window.alert("game is over")
        } else {
          pausePlay();
        console.log("round over");
        setCurrentRound(currentRound + 1);
        setRoundTimeRemaining(roundTimesMS[currentRound - 1]);
        }
      } else {
      setRoundTimeRemaining(roundTimeRemaining - 1000)
    }
  }}

  function pausePlay(){
    if(bigBlinds.length === parseInt(rounds) && smallBlinds.length === parseInt(rounds) && roundTimesMS.length === parseInt(rounds)){
      setPaused(!paused);
      console.log(!paused);
    } else {
      window.alert("Looks like you have a gap in your table, please ensure all rounds have a Time and both Blinds filled out")
    }
    } 


    // ######                                     
    // #     # ###### #    # #####  ###### #####  
    // #     # #      ##   # #    # #      #    # 
    // ######  #####  # #  # #    # #####  #    # 
    // #   #   #      #  # # #    # #      #####  
    // #    #  #      #   ## #    # #      #   #  
    // #     # ###### #    # #####  ###### #    # 


  return (
    <div className="App">
      <h1>Poker Timer</h1>

      {/* Section for setting the rounds in the game */}

      <button onClick={roundsDown}>Click to decrease rows</button><input id="numRounds" min="1" defaultValue="1" onChange={setNumRounds}></input><button onClick={roundsUp}>Click to increase rows</button>
      <div>
        <div id="inputs">
          <h5>There are {rounds} rounds</h5>
          {
            totalTimeMS < 3600000
            ? <h5>Total time will be {totalTimeMS/60000} minutes</h5>
            : <h5>Total time will be {Math.floor(totalTimeMS / 3600000)} hours and {(totalTimeMS % 3600000)/60000} minutes</h5>
          }
          {
            roundsArray.map((item)=>(
              <div key={item}>
                <i>Round: {item}    </i>
                <input className='smallBlinds' onChange={adjustSmallBlinds} placeholder='small blind' type='number' required tabIndex={item}></input>
                <input className='bigBlinds' onChange={adjustBigBlinds} placeholder='big blind' required tabIndex={parseInt(rounds)+item}></input>
                <input className='roundTimes' onChange={adjustTimes} placeholder='duration (m)' required defaultValue={0} tabIndex={(rounds*2)+item}></input>
                <br />
              </div>
            ))

          }
        </div>

      </div>
      <br></br>
      <button id="startButton" onClick={startTimer}>Begin</button>

      {/* Section for showing the countdown and pause/play buttons */}
      <button id="expandButton">Expand Countdown</button>
      <div id="countDownDiv">
        {
          roundTimeRemaining < 3600000
          ? roundTimeRemaining < 60000
            ? <h5>Time until increase is {roundTimeRemaining/1000} seconds</h5>
            : <h5>Time until increase is {Math.floor(roundTimeRemaining/60000)} minutes and {(roundTimeRemaining % 60000) /1000} seconds</h5>
          
          
          : <h5>Time until increase is {Math.floor(roundTimeRemaining/3600000)} hours and {(roundTimeRemaining % 3600000)/60000} minutes</h5>
        }
        
        <h5>Current Round: {currentRound} of {rounds}</h5>
        <h6>Small blind: {smallBlinds[currentRound-1]} Big blind: {bigBlinds[currentRound -1]} </h6>
        {
          paused
          ? <button onClick={pausePlay}>Play</button>
          : <button onClick={pausePlay}>Pause</button>
        }
      </div>

    </div>
  );
}

export default App;
