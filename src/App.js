
import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinimize, faMaximize, faPlus, faMinus, faPlay, faPause, faForward } from '@fortawesome/free-solid-svg-icons';
import sound from './shuffling-cards-5.mp3';

function App() {

  const [rounds, setRounds] = useState(1);
  const [roundsArray, setRoundsArray] = useState(Array.from({ length: rounds }, (_, i) => i + 1));
  const [roundTimesMS, setRoundTimesMS] = useState([]);
  const [smallBlinds, setSmallBlinds] = useState([]);
  const [bigBlinds, setBigBlinds] = useState([]);
  const [totalTimeMS, setTotalTimeMS] = useState();
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(0);
  const [paused, setPaused] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [windowed, setWindowed] = useState(false);

  useEffect(() => {

    setRoundsArray(Array.from({ length: rounds }, (_, i) => i + 1));



    const intervalID = setInterval(() => {
      countDown();
    }, 1000);
    return () => clearInterval(intervalID);
  }, [rounds, roundTimeRemaining, paused])

  function roundsUp() {
    let target = document.getElementById("numRounds")
    target.value++;
    setRounds(target.value)
  };

  function roundsDown() {
    let target = document.getElementById("numRounds");
    if (rounds > 1) {
      target.value--;
      setRounds(target.value)
    }
  }

  function setNumRounds(e) {
    setRounds(e.target.value)
  }

  //   ###                               ######                       
  //   #  #    # #####  #    # #####    #     #  ####  #    #  ####  
  //   #  ##   # #    # #    #   #      #     # #    # #    # #      
  //   #  # #  # #    # #    #   #      ######  #    # #    #  ####  
  //   #  #  # # #####  #    #   #      #   #   #    # # ## #      # 
  //   #  #   ## #      #    #   #      #    #  #    # ##  ## #    # 
  //  ### #    # #       ####    #      #     #  ####  #    #  ####

  function adjustTimes() {
    let timeInputs = Array.from(document.getElementsByClassName('roundTimes'));
    let tempArr = [];
    timeInputs.forEach((item) => {
      tempArr.push(parseInt(item.value * 60000))
    });
    setRoundTimesMS(tempArr);

    let totalTimetemp = tempArr.reduce((a, b) => {
      return a + b

    }, 0);
    setTotalTimeMS(totalTimetemp);
  };

  function adjustSmallBlinds() {
    let smallInputs = Array.from(document.getElementsByClassName('smallBlinds'));
    let tempArr = [];
    smallInputs.forEach((item) => {
      tempArr.push(item.value)
    });
    setSmallBlinds(tempArr)
  };

  function adjustBigBlinds() {
    let bigInputs = Array.from(document.getElementsByClassName('bigBlinds'));
    let tempArr = [];
    bigInputs.forEach((item) => {
      tempArr.push(item.value)
    });
    setBigBlinds(tempArr);
  };



  //   #####                                                              ##       ######                                     
  //  #     #  ####  #    # #    # ##### #####   ####  #    # #    #     #  #      #     #  ####  #    # #    # #####   ####  
  //  #       #    # #    # ##   #   #   #    # #    # #    # ##   #      ##       #     # #    # #    # ##   # #    # #      
  //  #       #    # #    # # #  #   #   #    # #    # #    # # #  #     ###       ######  #    # #    # # #  # #    #  ####  
  //  #       #    # #    # #  # #   #   #    # #    # # ## # #  # #    #   # #    #   #   #    # #    # #  # # #    #      # 
  //  #     # #    # #    # #   ##   #   #    # #    # ##  ## #   ##    #    #     #    #  #    # #    # #   ## #    # #    # 
  //   #####   ####   ####  #    #   #   #####   ####  #    # #    #     ###  #    #     #  ####   ####  #    # #####   ####  


  function moveArrow(){
    const tableRows = document.getElementsByTagName('tbody');
          if(tableRows.length === 1){
            tableRows[0].children[currentRound].classList.add('active');
            tableRows[0].children[currentRound -1].classList.remove('active');
          }
  }

  function startTimer() {

    if (checkArrays()) {
      pausePlay();
      setRoundTimeRemaining(roundTimesMS[currentRound - 1]);
      const button = document.getElementById('startButton');
      button.classList.add('hidden');
      expand();
      const tableRows = document.getElementsByTagName('tbody');
      tableRows[0].children[0].classList.add('active');
      setExpanded(!expanded);
    } else {
      window.alert("Looks like you have a gap in your table, please ensure all rounds have a Time and both Blinds filled out")
    }

  }

  function expand() {
    const card = document.getElementById('countDownDiv');


    if(paused && expanded || paused && !expanded && !windowed){
      card.classList.toggle('expanded');
      setExpanded(!expanded)
    } else {
      setWindowed(!windowed);
      setExpanded(!expanded);
      card.classList.toggle('expanded');
      card.classList.toggle('windowed');
    }



  }

  function countDown() {
    if (paused === false) {
      if (roundTimeRemaining === 0) {
        if (currentRound === parseInt(rounds)) {
          window.alert("game is over")
        } else {
          pausePlay();
          setCurrentRound(currentRound + 1);
          setRoundTimeRemaining(roundTimesMS[currentRound - 1]);
          let audio = new Audio(sound);
          audio.play();
          moveArrow();
        }
      } else {
        setRoundTimeRemaining(roundTimeRemaining - 1000)
      }
    }
  }

  function checkArrays(){
    if (bigBlinds.length === parseInt(rounds) && smallBlinds.length === parseInt(rounds) && roundTimesMS.length === parseInt(rounds) && bigBlinds.includes('') === false && smallBlinds.includes('') === false && roundTimesMS.includes(0)=== false) {
      return true
    }
  }

  function pausePlay() {
    if (checkArrays()) {
      setPaused(!paused);
    } else {
      window.alert("Looks like you have a gap in your table, please ensure all rounds have a Time and both Blinds filled out")
    }
  }

  function skipNextRound(){
    if(!paused){
      pausePlay()
    }
    setCurrentRound(currentRound + 1);
    setRoundTimeRemaining(roundTimesMS[currentRound]);
    moveArrow();
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
      <div id="container">
        <h1>Poker Timer</h1>

        {/* Section for setting the rounds in the game */}

        <div>
          <div id="inputs">
            {
              totalTimeMS === undefined
                ? <h5>There are no rounds set yet</h5>
                : rounds > 1
                  ? <h5>There are {rounds} rounds set</h5>
                  : <h5>There is 1 round set</h5>
            }

            {
              totalTimeMS === undefined
                ? <h5>Set your rounds below</h5>
                : totalTimeMS < 3600000
                  ? <h5>Total time will be {totalTimeMS / 60000} minutes</h5>
                  : <h5>Total time will be {Math.floor(totalTimeMS / 3600000)} hours and {(totalTimeMS % 3600000) / 60000} minutes</h5>
            }
            <div>
              <button onClick={roundsDown} className="roundAdjust adjustLeft"><FontAwesomeIcon icon={faMinus} /></button>
              <input id="numRounds" min="1" type="number" defaultValue="1" onChange={setNumRounds}></input>
              <button onClick={roundsUp} className="roundAdjust adjustRight"><FontAwesomeIcon icon={faPlus} /></button>
            </div>

            <br />
            <div id="inputRowsDiv">
              {
                roundsArray.map((item) => (
                  <div key={item}>
                    <i className='roundNum'>Round: {item}    </i>
                    <input className='smallBlinds roundInputBox' onChange={adjustSmallBlinds} placeholder='small blind' type='number' required tabIndex={item}></input>
                    <input className='bigBlinds roundInputBox' onChange={adjustBigBlinds} placeholder='big blind' type='number' required tabIndex={parseInt(rounds) + item}></input>
                    <input className='roundTimes roundInputBox' onChange={adjustTimes} placeholder='duration (m)' type='number' required defaultValue={0} tabIndex={(rounds * 2) + item}></input>
                    
                  </div>
                ))

              }
            </div>
          </div>

        </div>
        <br></br>
        <button id="startButton" onClick={startTimer}>Begin</button>

        {/* Section for showing the countdown and pause/play buttons */}
        <button id="expandButton" onClick={expand}>
          {
            expanded
              ? <FontAwesomeIcon icon={faMinimize} />
              : <FontAwesomeIcon icon={faMaximize} />
          }
        </button>
        <div id="countDownDiv">
          {

            // COUNTDOWN WINDOWED


            windowed ?
            <>
            <div>
              {
                roundTimeRemaining < 3600000
                  ? roundTimeRemaining < 60000
                    ? <><h5 ><span className='timerNumsWindowed'>{(roundTimeRemaining / 1000).toString().padStart(2, '0')}</span> s</h5></>
                    : <><h5 className='timerNumsWindowed'>{Math.floor(roundTimeRemaining / 60000)} : {((roundTimeRemaining % 60000) / 1000).toString().padStart(2, '0')}</h5></>
  
  
                  : <h5>Time until increase is {Math.floor(roundTimeRemaining / 3600000)} hours and {(roundTimeRemaining % 3600000) / 60000} minutes</h5>
              }
            </div>
            <div>
              <span>Small: <i className="blindNumWindowed">{smallBlinds[currentRound - 1]}</i></span> <span>Big <i className="blindNumWindowed">{bigBlinds[currentRound - 1]}</i></span>
            </div>
            {
                paused
                  ? <button className='pausePlay' onClick={pausePlay} style={{color: 'green'}}><FontAwesomeIcon icon={faPlay} /></button>
                  : <button className='pausePlay' onClick={pausePlay} style={{color: 'red'}}><FontAwesomeIcon icon={faPause} /></button>
              }
  
              <button className='pausePlay' onClick={skipNextRound}><FontAwesomeIcon icon={faForward} /></button>
            </>
            :          
            
            // COUNTDOWN FULLSCREEN 


            <div id="countDownInner">

              <span id="countdownTableContainer" >
                <table id="roundsTableDisplay">
                  <thead>
                  <tr>
                    <th>Round no.</th>
                    <th>Small blind</th>
                    <th>Big Blind</th>
                    <th>Duration (m)</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    roundsArray.map((item)=>(
                      <tr key={item}>
                        <th>{item}</th>
                        <th>
                          { smallBlinds[item-1] === undefined 
                          ? '--' 
                          : smallBlinds[item-1]
                          }
                        </th>
                        <th>
                          { bigBlinds[item-1] === undefined 
                          ? '--' 
                          : bigBlinds[item-1]
                          }
                          </th>
                        <th>
                        { isNaN(roundTimesMS[item-1])
                          ? '--' 
                          : roundTimesMS[item-1]/60000
                          }
                          </th>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </span>

              <span id="countdownTimerContainer">
                <div><h5 id="roundTitle">Current Round:</h5><h5> {currentRound} of {rounds}</h5></div>
                  {
                    roundTimeRemaining < 3600000
                      ? roundTimeRemaining < 60000
                        ? <><h5>Blinds increase in: </h5> <h5><span className='timerNums'>{(roundTimeRemaining / 1000).toString().padStart(2, '0')}</span> s</h5></>
                        : <><h5>Blinds increase in: </h5> <h5 className='timerNums'>{Math.floor(roundTimeRemaining / 60000)}:{((roundTimeRemaining % 60000) / 1000).toString().padStart(2, '0')}</h5></>
      
      
                      : <h5>Time until increase is {Math.floor(roundTimeRemaining / 3600000)} hours and {(roundTimeRemaining % 3600000) / 60000} minutes</h5>
                  }
                  
      
                  
                  <h6>
                    <span className="blindLabels">Small blind: <i className="blindNum">{smallBlinds[currentRound - 1]}</i></span>  
                    <span className="blindLabels">Big blind: <i className="blindNum">{bigBlinds[currentRound - 1]}</i> </span>
                  </h6>
                  {
                    paused
                      ? <button className='pausePlay' onClick={pausePlay} style={{color: 'green'}}><FontAwesomeIcon icon={faPlay} /></button>
                      : <button className='pausePlay' onClick={pausePlay} style={{color: 'red'}}><FontAwesomeIcon icon={faPause} /></button>
                  }
      
                  <button className='pausePlay' onClick={skipNextRound}><FontAwesomeIcon icon={faForward} /></button>
              </span>

            </div>
          }


        </div>

      </div>
      
    </div>
  );
}

export default App;
