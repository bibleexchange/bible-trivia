import React from 'react';
import {alphaOpts, shuffleArray} from '../../Helpers'
import SoundPlayer from "../SoundPlayer"
import RandomImage from "../../features/RandomImage"

function QuestionOptions({data, question}){

    let option = ()=>{return null}
    if(question.randomOptions === undefined){
       question.randomOptions = shuffleArray(question.choices)
    }

    if(data.option !== false && !data.options.MULTIPLE_CHOICE){
      option = ()=>{return <h1>{question.choices[data.option]}</h1>}
    }else if(data.option !== false){
      let optionClass = ""
      option = ()=>{
        return <ul>{question.randomOptions.map(function(choice,index){
          if(data.option === index){
            optionClass = "active-choice"
          }else{
            optionClass = ""
          }
          return <li key={index} className={optionClass}>{alphaOpts[index]}) {choice.string}</li>
        })}</ul>
      }
    }
    return option()
}

function Stage2({question, choices, nextOption, playSound, sfx, playerHasNotAnsweredBefore,askQuestion,image, audio,data, setData, questionFinished, musicEffect}){
    
    let autoFocusInput = ""
    console.log(data.buzzed)
    if(data.option !== false){

      audio = <SoundPlayer max={5} hide={true} src={"/audio/dramaticbuilding.mp3"} onEnd={()=>{}}/>
      autoFocusInput = <input autoFocus 
        defaultValue=""
    
        onKeyUp={(event)=>{
          let key = Number(event.key)

      if([0,1,2,3,4,5,6,7,8,9].includes(key) && !data.buzzed.includes(key)){
       let newData = {...data, buzzed: [...data.buzzed,key]}
       playSound(key, sfx, null, data, setData)

       let i = 0;

       while (i < newData.players.length){
        if(newData.players[i].active === key && playerHasNotAnsweredBefore(newData.players[i], data)){
          let score = 0

          if(data.options.MULTIPLE_CHOICE){
              let index = question.randomOptions[data.option].index
              let test = index === newData.questions[newData.question].choices.length-1
             score = {id: newData.questions[newData.question].id, round:data.round, score: test? data.options.POINTS.correct:data.options.POINTS.wrong, option:index, answer:data.option}
           }else{
             score = {id: newData.questions[newData.question].id, round:data.round, score: newData.questions[newData.question].choices.length === (data.option+1)? data.options.POINTS.correct:data.options.POINTS.wrong, option:data.option}
           }

          newData.players[i].scores.push(score)
          break;
        }            
        i++;
       }
       setData(newData)
      }else if(event.which === 13){//ENTER
        console.log('ENTER PRESSED')
        playSound(0, sfx, null, data, setData)
        setData({...data, test:0})
        //setTimeout(start,1000);
      }

    }} />
    }

    let img = data.option === false? <RandomImage />:""

    if(image){
      img = <div>{image}</div>
    }

    return (
    <div className={"box questionOption"+data.option}>

      <div className="box-contents">
        <div>{askQuestion}{audio}{autoFocusInput} <QuestionOptions data={data} question={question} choices={choices}/></div>
        {img}
      </div>
    </div>)
}

export default Stage2;