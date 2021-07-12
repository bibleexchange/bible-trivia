import {playerHasNotAnsweredBefore, nextOption} from '../../Helpers'
import logo from '../../logo.svg';
import React, { useState } from 'react';
import Timer from './Timer'
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
import ImageMap from "../ImageMap";
import SoundPlayer from "../SoundPlayer"
import {getRandom} from '../../Helpers'
import {shuffleArray} from '../../Helpers'
import {alphpaOpts, translateOption} from '../../Helpers'

function buzzersReady(hasQuestions, data, setData){
  if(hasQuestions){
      let newData = {...data}
      newData.stage = 2
      setData(newData)
    }else{
      let newData = {...data}
      newData.stage = 0
      setData(newData)
    }
}

function playSound(index, sfx, audioEnded, data, setData){
  sfx[index].audio.play();
}

function questionFinished(data, setData){
    let newData = {...data}
    let i = 0

    while (i < newData.players.length){
      if(newData.players[i].active !== false && playerHasNotAnsweredBefore(newData.players[i], newData)){
        const score = {id: newData.question, score: -25, option:newData.option}
        newData.players[i].scores.push(score)
      }            
      i++;
     }
    newData.option = false
    newData.question = false
    newData.stage = 0
    setData(newData)
}

function BannerContents({data, setData, questionId}){

      const [sfx, setSfx] = useState([
        {audio: new Audio(sfx0), isPlaying:false},
        {audio: new Audio(sfx1), isPlaying:false},
        {audio: new Audio(sfx2), isPlaying:false},
        {audio: new Audio(sfx3), isPlaying:false},
        {audio: new Audio(sfx4), isPlaying:false},
        {audio: new Audio(sfx5), isPlaying:false},
        {audio: new Audio(sfx6), isPlaying:false},
        {audio: new Audio(sfx7), isPlaying:false},
        {audio: new Audio(sfx8), isPlaying:false},
        {audio: new Audio(sfx9), isPlaying:false}      
        ])

    const [test, setTest] = useState("test")

      let askQuestion = <p>CONGRATULATIONS! YOUR GROUP HAS ANSWERED ALL THE QUESTIONS</p>
      let hasQuestions = false
      let audio = ""
      let image = null

      if(data.questions[data.question]){
        hasQuestions = true
        let q = data.questions[data.question]
        let src = "/audio/silence.mp3"
        if(q.audio){
          src = q.audio
        }
        let hide = true

        if(data.option === false){
          hide = false
        }
 
        if(q.image && q.image.src != ""){
          image = <ImageMap src={q.image.src} coords={q.image.coords} />
        }

          audio = <div><SoundPlayer max={7} hide={hide} src={src} onEnd={()=>{nextOption(data,setData);}}/></div>

        askQuestion = <p>[{q.id}] {q.question}</p>
      }

  switch(data.stage){

    case 1:
         return (<div className="box"
          onClick={()=>{
            buzzersReady(hasQuestions, data, setData)
        }}><div className="box-contents">
          <h1>GET BUZZERS READY! </h1>
          <SoundPlayer max={2} src={"/audio/silence2.mp3"} onEnd={()=>{buzzersReady(hasQuestions, data, setData);}}/>
        </div></div>)
      break;

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
        />
        break;

      case 3:
        let question = data.questions[data.question]
        let answerIndex = question.choices.length-1
        let theAnswer = question.choices[answerIndex]
        let alphaOption = alphpaOpts[answerIndex]
  
        if(data.mc){
          alphaOption = translateOption(question)
        }

        return (
        <div className="box" onClick={()=>{questionFinished(data, setData)}}>
          <div className="box-contents">
          <p>{question.question}</p>
          <h1>{alphaOption}) {theAnswer}</h1>
          <SoundPlayer max={5} hide={true} src={"/audio/correct.mp3"} onEnd={()=>{questionFinished(data, setData)}}/>
          </div>
        </div>
)
        break;

    default:
       return (<div className="box"><div className="box-contents">
       <input className="test" onBlur={()=>{setTest("test")}} onKeyPress={(event)=>{
         if([0,1,2,3,4,5,6,7,8,9].includes(Number(event.key))){
           const player = Number(event.key)
           playSound(player, sfx)
           let newData = {...data}
           newData.test = player
           setData(newData)
           setTest(event.key)
         }
       }} value={test}/><img src={logo} className="App-logo" alt="logo"/>
      <button className="start" onClick={()=>{
        let newData = {...data}
        newData.stage = 1

        let answered = []

        newData.players.forEach(function(player){
          if(player.active !== false){
            player.scores.forEach((score)=>{
              answered.push(score.id)
            })
          }
        })
        
        let i = 0;
        let unasked = []
        while (i < newData.questions.length) {
          /*1) Not asked before and 2) Has at least 4 choices */
          if(!answered.includes(i) && newData.questions[i].choices.length > 2){          
            unasked.push(i)
          }
          i++;
        }

        if(questionId){
          if(!answered.includes(questionId)){
            newData.question = questionId
          }else{
            newData.question = unasked[getRandom(unasked.length) | 0]
          }
          
        }else{
          newData.question = unasked[getRandom(unasked.length) | 0]
        }
        
        if(data.mc){
          newData.questions[newData.question].randomOptions = shuffleArray(newData.questions[newData.question].choices)
        }
        newData.test = false
        setData(newData)
      }}>start</button></div></div>)
  }
}

export default BannerContents;