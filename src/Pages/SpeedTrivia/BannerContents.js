import {playerHasNotAnsweredBefore, nextOption} from '../../Helpers'
import logo from '../../logo.svg';
import React, { useState } from 'react';
import Stage2 from './Stage2'

import sfx1 from "../../buzzers/1.wav";
import sfx2 from "../../buzzers/2.wav";
import sfx3 from "../../buzzers/3.wav";
import sfx4 from "../../buzzers/4.wav";
import sfx5 from "../../buzzers/5.wav";
import sfx6 from "../../buzzers/6.wav";
import sfx7 from "../../buzzers/7.wav";
import sfx8 from "../../buzzers/8.wav";
import sfx9 from "../../buzzers/9.wav";
import sfx0 from "../../buzzers/0.wav";

import sfxb1 from "../../buzzers/farm/angry-cow.mp3";
import sfxb2 from "../../buzzers/farm/cat.mp3";
import sfxb3 from "../../buzzers/farm/ducks.mp3";
import sfxb4 from "../../buzzers/farm/turkey.mp3";
import sfxb5 from "../../buzzers/farm/owl.mp3";
import sfxb6 from "../../buzzers/farm/rooster.mp3";
import sfxb7 from "../../buzzers/farm/cat-squeel.mp3";
import sfxb8 from "../../buzzers/farm/pig.mp3";
import sfxb9 from "../../buzzers/farm/cow.mp3";
import sfxb0 from "../../buzzers/farm/lamb.mp3";

import ImageMap from "../ImageMap";
import SoundPlayer from "../SoundPlayer"
import {getRandom} from '../../Helpers'
import {shuffleArray} from '../../Helpers'
import {translateOption} from '../../Helpers'
import FireWorks from '../../features/fireworks/FireWorks'
import Timer from './Timer'

const sfx = [
    [
    new Audio(sfx0),
    new Audio(sfx1),
    new Audio(sfx2),
    new Audio(sfx3),
    new Audio(sfx4),
    new Audio(sfx5),
    new Audio(sfx6),
    new Audio(sfx7),
    new Audio(sfx8),
    new Audio(sfx9)      
    ],
    [
    new Audio(sfxb0),
    new Audio(sfxb1),
    new Audio(sfxb2),
    new Audio(sfxb3),
    new Audio(sfxb4),
    new Audio(sfxb5),
    new Audio(sfxb6),
    new Audio(sfxb7),
    new Audio(sfxb8),
    new Audio(sfxb9)
    ]
    ];

function buzzersReady(hasQuestions, data, setData){

    let newData = {...data}

    if(hasQuestions){
      newData.stage = 2
    }else{
      newData.stage = 0
    }
    setData(newData)
}

function playSound(index, sfx, audioEnded, data, setData){
  sfx[data.options.SFX][index].volume = 1;  
  if(audioEnded !== null){
    sfx[data.options.SFX][index].onended = audioEnded
  }
  if(sfx[data.options.SFX][index].paused){
    sfx[data.options.SFX][index].play();
  }
}

function questionFinished(data, setData, updateScores=true){

    let newData = {
      ...data,
      option: false,
      question:false,
      stage:0
    }

    if(updateScores){
      newData.players = data.players.map((player)=>{
        if(player.active !== false && playerHasNotAnsweredBefore(player, data)){
          const score = {answer: null, id: data.questions[data.question].id, option: null, round: data.round, score: -25}
          console.log(score)
          player.scores.push(score)
        }
        return player;    
      })
    }
    setData(newData)
}

function BannerContents({data, setData, questionId, unasked, musicEffect}){

    const [test, setTest] = useState("READY")

    const start = ()=>{
          let newData = {
          ...data,
          stage: 1,
          buzzed:[]//context: new window.AudioContext()
        }

        if(questionId){
          if(unasked.includes(questionId)){
            newData.question = questionId
          }else{
            newData.question = unasked[getRandom(unasked.length) | 0]
          }
          
        }else{
          newData.question = unasked[getRandom(unasked.length) | 0]
        }
        
        if(newData.question === false || newData.filteredQuestions.length < 1 || newData.question === undefined){
          console.log(newData.question,'no questions to ask')
        }else{
          
          if(data.options.MULTIPLE_CHOICE){
            let index = null
            let question = newData.questions.filter(( q,i ) => {
             index = i; 
             return q.id === newData.question
           })

            if(Array.isArray(question)){
              question = question[0]
            }
            
            question.randomOptions = shuffleArray(question.choices)

            newData.questions[index] = question
          }
          newData.test = false

          
        }
        setData(newData)
    }
      let hide = true
      let askQuestion = <p>YOUR GROUP HAS ANSWERED ALL THE QUESTIONS. <FireWorks /></p>
      let hasQuestions = false
      let audio = <div id="timer"><Timer start={5} onEnd={()=>{
           nextOption(data,setData);
           }}/></div>
      let image = ""

      if(data.questions[data.question]){
        hasQuestions = true
        let q = data.questions[data.question]
       
        if(q.audio){
          audio = <div><SoundPlayer max={7} hide={hide} src={q.audio} onEnd={()=>{nextOption(data,setData);}}/></div>
        }

        if(data.option === false){
          hide = false
        }
 
        if(q.image && q.image.src !== ""){
          image = <ImageMap src={q.image.src} coords={q.image.coords} />
        }          

        askQuestion = <p>[{q.id}] {q.question}</p>
      }

  switch(data.stage){

    case 1:
        let music = new Audio("/audio/3-dings-ascending2.mp3")
        music.volume = "0.07"
        music.play()

         return (<div className="box"
          onClick={()=>{
            buzzersReady(hasQuestions, data, setData)
        }}><div className="box-contents">

          <h1>{hasQuestions? "GET BUZZERS READY!":askQuestion}</h1>
           <div id="timer"><Timer start={3} onEnd={()=>{
            buzzersReady(hasQuestions, data, setData)
           }}/></div>

        </div></div>)

    case 2:

      

      return <Stage2 
        question={data.questions[data.question]}
        data={data}
        setData={setData}
        nextOption={nextOption}
        playSound={playSound}
        sfx={sfx}
        playerHasNotAnsweredBefore={playerHasNotAnsweredBefore}
        askQuestion={askQuestion}
        image={image}
        audio={audio}
        questionFinished={questionFinished}
        />

      case 3:
        let question = data.questions[data.question]
        let answerIndex = question.choices.length-1
        let theAnswer = question.choices[answerIndex]
        let alphaOption = ""
  
        if(data.options.MULTIPLE_CHOICE){
          alphaOption = translateOption(question)+") "
        }

        return (
        <div className="box" onClick={()=>{questionFinished(data, setData, !data.options.TEAM_MODE)}}>
          <SoundPlayer max={5} hide={true} src={"/audio/leadingup2.mp3"} onEnd={()=>{}}/>
          <div className="box-contents">
          <p>{question.question}</p>
          <h1>{alphaOption} {theAnswer}</h1>
          <h2>{question.scripture}</h2>
            <div id="timer"><Timer start={5} onEnd={()=>{
             questionFinished(data, setData, !data.options.TEAM_MODE)
             }}/></div>
          
          </div>
        </div>
        )

    default:      
       
       return (<div className="box"><div className="box-contents">
       <input className="test" 
       autoFocus
        onBlur={()=>{setTest("READY")}} 
        onKeyUp={(e)=>{
          switch(e.which){
            case 13://ENTER
              start();
              break
            case 48://NUMBER KEYS: 0
            case 49://NUMBER KEYS: 1
            case 50://NUMBER KEYS: 2
            case 51://NUMBER KEYS: 3
            case 52://NUMBER KEYS: 4
            case 53://NUMBER KEYS: 5
            case 54://NUMBER KEYS: 6
            case 55://NUMBER KEYS: 7
            case 56://NUMBER KEYS: 8
            case 57://NUMBER KEYS: 9
              const num = e.which-48
              console.log('NUMBER KEY was pressed', num)
               playSound(num, sfx, null, data, setData)
               let newData = {...data}
               newData.test = num
               setData(newData)
               setTest(num)
              break

            case 85://UP
              console.log('UP was pressed', 85)
              break

            default:
              console.log("MISSED THIS: ", e.which)
          }
        }}

        value={test} onChange={()=>{}}/><img src={logo} className="App-logo" alt="logo"/>
      <button className="start" onClick={start}>start</button></div></div>)
  }
}

export default BannerContents;