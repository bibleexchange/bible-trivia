import './Index.css';
import BannerContents from './BannerContents'
import React, { useState } from 'react';
import {alphpaOpts} from '../../Helpers'
import {
  useParams
} from "react-router-dom";

function saveData(data){
  localStorage.setItem('quizdata', JSON.stringify(data));
}

function loadData(setData){
  let d = JSON.parse(localStorage.getItem('quizdata'));
  setData(d)
}

function Index() {

const [data, setData] = useState({
  admin: false,
  test:false,
  stage:0,
  mc:true,
  players: [
    {id:"Stephen III", scores:[], active:false},
    {id:"Jeremiah", scores:[], active: false},
    {id:"Benjamin", scores:[], active: false},
    {id:"Ellyanna", scores:[], active: false},
    {id:"Rosemary", scores:[], active: false},
    {id:"Elizabeth", scores:[], active: false},
    {id:"Stephen Jr", scores:[], active: 0},
    {id:"Laura", scores:[], active: 1},
    {id:"violet", scores:[], active: false},
    {id:"ruth", scores:[], active: false},
    {id:"john", scores:[], active: false}
  ],
  question:false,
  option: false,
  questions: JSON.parse(localStorage.getItem('bible-questions'))
});

 let { questionId } = useParams();
console.log(questionId)
  return (
    <div className="App">
      <div id="banner" className={"stage" + data.stage}>
        <BannerContents data={data} setData={setData} questionId={questionId}/>
      </div>
      <Scores players={data.players} data={data} setData={setData}/>
      <hr/>
      <Players data={data} setData={setData}/>
      <hr/>
      <button onClick={()=>{
        saveData(data)
      }}>save</button>

      <button onClick={()=>{
        loadData(setData)
      }}>load</button>
    </div>
  );
}

function Scores(props){
  let sc = {}

  return (
  <ul className="flex-container">
    {props.players.sort((a,b)=>{
        if (a.active > b.active) return 1;
        if (b.active > a.active) return -1;
        return 0;
    }).map(function(player, index){
      if(player.active !== false){
        sc = score(player.scores)
        let answered = false
        let playerClass = 'inactive'

        player.scores.forEach((sc)=>{
          if(sc.id === props.data.question){
            answered = sc
          }
        })

        if(answered || props.data.test === player.active){
          playerClass = "active"
        }

        if(answered){

          let opt = 0

          player.scores.forEach((score)=>{
            if(score.id === props.data.question){opt = score.answer}
          })

          return (<li key={player.id} className={playerClass}>
          <span className="controller">{player.active}</span>
          <span className="score">{alphpaOpts[opt]}</span>
          <span className="name">{player.id}</span> 
          </li>)
        }

        return (<li key={player.id} className={playerClass} onClick={()=>{
          updatePlayer({...player, active:false}, index, props.data, props.setData)}
        }>

          <span className="controller">{player.active}</span>
          <span className="score">{sc.alltime}</span><br/>
          <span className="name">{player.id}</span> 
        </li>)
      }else{
        return null
      }
    })}
  </ul>)
}

function score(scores){

  if(scores.length <= 0){
    return {
      score:0, alltime:0
    }
  }

  let allTimeScore = Number(0)
  let correct = 0

  scores.forEach(function(score){
    if(Math.sign(score.score) === 1){
      correct++;
    }
    allTimeScore += Number(score.score);
  })

  let sc = Math.round(Number(allTimeScore)/correct)

  if(sc < 0){
    sc = 0
  }
  return {
    score: sc,
    alltime: allTimeScore
  };
}

function updatePlayer(player, playerIndex, data, setData){
  let newData = {...data}

  if(playerIndex === false){
    newData.players.push(player)
  }else{
    newData.players[playerIndex] = player
  }
  
  setData(newData)
}

function Players(props){

  let controllers = [0,1,2,3,4,5,6,7,8,9]
  let activeControllers = []

  props.data.players.forEach(function(pla){
    if(pla.active !== false){
      activeControllers.push(pla.active)
    }
  })

  let openController = controllers.filter((ctrl)=>{
    if(!activeControllers.includes(parseInt(ctrl))){
      return ""+ctrl+"";
    }
  })

  let addPlayer = null

  if(openController.length > 0){
    addPlayer = <div><select id="controller" name="controller">
      {openController.map((oc)=>{
        return <option key={oc} value={oc}>{oc}</option>
      })}
      </select><input style={{width:"95%"}} type="submit" value="play"/></div>
  }

  return (
  <ul className="flex-container">
    {props.data.players.map(function(player, index){

        let playerClass = 'inactive'
        if(player.active === false){
          return (<li key={player.id} className={"small " + playerClass}>
            
            <form onSubmit={(event)=>{
              event.preventDefault();
                player.active = parseInt(event.target[0].value)
                updatePlayer(player, index, props.data, props.setData)
            }}>{addPlayer}</form> 

            <span className="name">{player.id} [{score(player.scores).alltime}]</span>

          </li>)      
        }else{
          return null
        }

    })}

            <li><form onSubmit={(event)=>{
              event.preventDefault();
                let pl = {
                  id:null, scores:[], active:false
                }
                const form = new FormData(event.target);
                pl.id = form.get("name")
                updatePlayer(pl, false, props.data, props.setData)
            }}><input style={{width:"90%", color:"black",border:"solid 1px black"}} type="text" id="name" name="name"/><input type="submit" /></form> </li>
  </ul>)
}

export default Index;
