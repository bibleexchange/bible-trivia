import React, { useState } from 'react';
import {alphpaOpts} from '../../Helpers'

function QuestionOptions({data, question}){
    let option = ()=>{return null}

    if(question.choices[data.option] !== undefined){
      option = ()=>{return question.choices[data.option]}
    }

    if(data.option !== false && !data.mc){
      option = ()=>{return <h1>{option}</h1>}
    }else if(data.option !== false){
      let optionClass = ""
      option = ()=>{
        return <ul>{question.randomOptions.map(function(choice,index){
          if(data.option === index){
            optionClass = "active-choice"
          }else{
            optionClass = ""
          }
          return <li className={optionClass}>{alphpaOpts[index]}) {choice.string}</li>
        })}</ul>
      }
    }
    return option()
}

function Stage2({question, choices, nextOption, playSound, sfx, playerHasNotAnsweredBefore,askQuestion,image, audio,data, setData}){
    
    let autoFocusInput = ""

    if(data.option !== false){
      autoFocusInput = <input autoFocus 
        defaultValue="" 
        onClick={()=>{nextOption(data,setData);}}
    
        onKeyPress={(event)=>{

      if([0,1,2,3,4,5,6,7,8,9].includes(Number(event.key))){
       let newData = {...data}
       const player = Number(event.key)
       playSound(player, sfx, nextOption, data, setData)

       let i = 0;

       while (i < newData.players.length){
        if(newData.players[i].active === player && playerHasNotAnsweredBefore(newData.players[i], data)){
          let score = 0

          if(data.mc){
              let index = question.randomOptions[data.option].index
              let test = index === newData.questions[newData.question].choices.length-1
             score = {id: newData.question, score: test? 100:-25, option:index, answer:data.option}
           }else{
             score = {id: newData.question, score: newData.questions[newData.question].choices.length === (data.option+1)? 100:-25, option:data.option}
           }

          newData.players[i].scores.push(score)
          break;
        }            
        i++;
       }
       setData(newData)
      }

    }} />
    }



    return (
    <div className={"box questionOption"+data.option}>
      <div className="box-contents">
        <div style={{width:"800px"}}>{askQuestion}{audio}{autoFocusInput}</div>
        <div>{image} <QuestionOptions data={data} question={question} choices={choices}/></div>
      </div>
    </div>)
}

export default Stage2;