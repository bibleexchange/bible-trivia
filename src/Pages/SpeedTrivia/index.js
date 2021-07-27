import './Index.css';
import BannerContents from './BannerContents'
import React, { useState } from 'react';
import {alphaOpts, calculateScores, translateOption} from '../../Helpers'
//import Timer from './Timer'
import {
  useParams
} from "react-router-dom";
import UploadJsonForm from '../../features/UploadJsonForm'
import {saveAsFile} from '../../Helpers'

function saveData(data){
  const newData = {
    ...data,
    filteredQuestions: false
  }
  localStorage.setItem('bible-trivia-db', JSON.stringify(newData));
  saveAsFile(newData, 'bible-trivia-db')
}

function filterQuestions(qs,filter){
  let q = qs.filter(q => q.tags.toLowerCase().includes(filter) || q.question.toLowerCase().includes(filter)).filter(q => q.choices.length >= 2)
  return q
}

function Index() {

let loadedData = JSON.parse(localStorage.getItem('bible-trivia-db'))
if(loadedData === null){
  loadedData = {}
}else{
  loadedData.filteredQuestions = filterQuestions(loadedData.questions,loadedData.options.FILTER)
}


const [data, setData] = useState({
  admin: false,
  round:1,
  test:false,
  stage:0,
  options:{
    MULTIPLE_CHOICE:true,
    QUESTION_ORDER:"RANDOM",
    FILTER:"",
    TEAM_MODE:false,
    SFX:1,
    TEAM_NAMES:["BOYS","GIRLS"],
    POINTS:{
      wrong:-25,
      correct:50
    }
  },
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
    {id:"john", scores:[], active: false},

    {id:0, scores:[], active: false},
    {id:1, scores:[], active: false},
    {id:2, scores:[], active: false},
    {id:3, scores:[], active: false},
    {id:4, scores:[], active: false},
    {id:5, scores:[], active: false},
    {id:6, scores:[], active: false},
    {id:7, scores:[], active: false},
    {id:8, scores:[], active: false},
    {id:9, scores:[], active: false}

  ],
  question:false,
  option: false,
  questions:[],
  filteredQuestions:[],
  buzzed:[],
  ...loadedData
});

 let { questionId } = useParams();

 let timed = null

  if(data.time && data.time.seconds === 0){
    timed = <p style={{height:"100%"}}>DONE</p>  
  }else{
    timed = null//<Timer data={data} setData={setData}/>
  }
  const askedIds = data.players.filter(player => player.active !== false && player.scores.length >= 1).map(p => p.scores.map(score=>score.id)).flat(2).filter((x, i, a) => a.indexOf(x) === i)
  const unaskedQuestions = data.filteredQuestions.filter(qs => !askedIds.includes(qs.id)).map(q=>q.id)
  const deactivateAllPlayers = ()=>{
  const players = data.players.map((player)=>{player.active = false; return player})

      setData({
        ...data,
        options:{
          ...data.options,
          TEAM_MODE:false
        },
        players: [...players]
      })
  }

   const activateTeams = ()=>{
    const team = [0,1,2,3,4,5,6,7,8,9]
     const players = data.players.map((player)=>{
      if(team.includes(player.id)){
        player.active = player.id
        return player
      }else{
        player.active = false
        return player
      }
    })
    setData({
      ...data,
      options:{
        ...data.options,
        TEAM_MODE:true
      },
      players: [...players]
    })
  }

  return (
    <div className="App">
      
      <div id="banner" className={"stage" + data.stage}>
        <BannerContents data={data} setData={setData} questionId={parseInt(questionId)} unasked={unaskedQuestions} />
      </div>
      <div id="timer">
      {timed}
      </div>
      <Scores data={data} setData={setData}/>
      <hr/>
      <Players data={data} setData={setData}/>
      <hr/>

      <div className="flex-container dark">

        <li className="small">
          <button onClick={()=>{saveData(data)}}>save</button>
        </li>

        <li className="small">
          <button onClick={()=>{
            setData({
              ...data,
              options:{
                ...data.options,
                MULTIPLE_CHOICE:!data.options.MULTIPLE_CHOICE
              }
            })
          }}>{data.options.MULTIPLE_CHOICE? "MULTIPLE CHOICE":"NOT MULTIPLE CHOICE"}</button>
        </li>

        <li className="small">
      <button onClick={()=>{

        if(data.options.TEAM_MODE){
          deactivateAllPlayers()
        }else{
          activateTeams()
        }

      }}>{data.options.TEAM_MODE? "TEAM MODE":"INDIVIDUAL MODE"}</button>
      </li>

        <li className="small">
      <button onClick={()=>{
        setData({
          ...data,
          options:{
            ...data.options,
            SFX:data.options.SFX === 0? 1:0
          }
        })
      }}>{data.options.SFX === 0? "DIGITAL SFX":"FARM SFX"}</button>
      </li>

      <li className="small">
      FILTER: <input value={data.options.FILTER} onChange={(e)=>{   
        setData({...data, options: {...data.options, FILTER:e.target.value}})
      }} onBlur={(e)=>{
        const filter = data.options.FILTER.toLowerCase()
        const newData = {...data, filteredQuestions: filterQuestions(data.questions,filter)}
        setData(newData)
      }}/>
      </li>

      <li className="small">ROUND:{data.round}
        <div><p onClick={(e)=>{setData({...data, round: 1})}}>1</p>
        <p onClick={(e)=>{setData({...data, round: 2})}}>2</p>
        <p onClick={(e)=>{setData({...data, round: 3})}}>3</p>
        <p onClick={(e)=>{setData({...data, round: 4})}}>4</p>
        <p onClick={(e)=>{setData({...data, round: 5})}}>5</p>
        <p onClick={(e)=>{setData({...data, round: 6})}}>6</p></div>
      </li>

      <li className="small">LOAD DATA: <UploadJsonForm doWithResults={(json)=>{
          json.filteredQuestions = filterQuestions(json.questions,json.options.FILTER)
          setData({...data, ...json})
          localStorage.setItem('bible-trivia-db',JSON.stringify(json))
      }}/></li>

        <li className="small">LOAD QUESTIONS: <UploadJsonForm doWithResults={(json)=>{
          json.filteredQuestions = filterQuestions(json.questions,json.options.FILTER)
          const newData = {...data, filteredQuestions: json.filteredQuestions, questions:[...json.questions], memo: json.memo}
          setData(newData)
          localStorage.setItem('bible-trivia-db',JSON.stringify(newData))
      }}/></li>

      <li className="small">LOAD PLAYERS: <UploadJsonForm doWithResults={(json)=>{
          const newData = {...data, players: [...json.players]}
          setData(newData)
          localStorage.setItem('bible-trivia-db',JSON.stringify(newData))
      }}/></li>

      <li className="small"><button onClick={()=>{

        const team = [0,1,2,3,4,5,6,7,8,9]

        setData({
          ...data,
          players: data.players.map(function(player){
            if(team.includes(player.id)){
              player.scores = []
            }
            return player
          })
        })
      }}>CLEAR TEAM HISTORY</button></li>

            <li className="small"><button onClick={()=>{

        const team = [0,1,2,3,4,5,6,7,8,9]

        setData({
          ...data,
          players: data.players.map(function(player){
            if(data.options.TEAM_MODE && team.includes(player.id)){
              player.scores = player.scores.map((sc)=>{
                if(sc.round === data.round){sc.round = null}
                return sc
             })
            }else if(!data.options.TEAM_MODE && !team.includes(player.id)){
              player.scores = player.scores.map((sc)=>{
               if(sc.round === data.round){sc.round = null}
                return sc
             })

            }
            console.log(player)
            return player
          })
        })
      }}>RESET ROUND</button></li>

      </div>

      <div style={{display:"flex", flexWrap: "nowrap", justifyContent: "space-between", color:"black"}}>
        <div>
        <h2>All Questions in Data ({data.filteredQuestions.length})</h2>
        <ol>
        {data.filteredQuestions && data.filteredQuestions.map(function(q,i){
            if(askedIds.includes(q.id)){
              return <li key={i} style={{color:"red"}}>[{q.id}] {q.question} ({q.choices.length})</li>
            }else{
              return <li key={i}>[{q.id}] {q.question} ({q.choices.length})</li>
            }
          
        })}
        </ol>
        </div>
        <div>
        <h2>Questions Used</h2>
        <ol>
        {askedIds.map(function(id){
          return <li key={id}>{id}</li>
        })}
        </ol>
        
        </div>
        <div>
        </div>
      </div>

    </div>
  );
}

function renderIndividualScores(props){
 return (
  <ul className="flex-container">
    {props.data.players.sort((a,b)=>{
        if (a.active > b.active) return 1;
        if (b.active > a.active) return -1;
        return 0;
    }).map(function(player, index){
      if(player.active !== false){
        let calculatedScore = calculateScores(player.scores, props.data.round)
        let answered = false
        let playerClass = 'inactive'

        player.scores.forEach((sc)=>{

          if(props.data.question && sc.id === props.data.questions[props.data.question].id){
            answered = sc
          }
        })

        if(answered || props.data.test === player.active){
          playerClass = "active"
        }

        if(answered && props.data.question){

          let opt = 0

          player.scores.forEach((score)=>{
            if(score.id === props.data.questions[props.data.question].id){opt = score.answer}
          })

          return (<li key={player.id} className={playerClass}>
          <span className="controller">{player.active}</span>
          <span className="score">{alphaOpts[opt]}</span>
          <span className="name">{player.id}</span> 
          </li>)
        }

          return (<li key={player.id} className={playerClass} onClick={()=>{
            updatePlayer({...player, active:false}, index, props.data, props.setData)}
          }>

          <span className="controller">{player.active}</span>
          <span className="score">{calculatedScore.round}</span><br/>
          <span className="name">{player.id}</span> 
        </li>)
      }else{
        return null
      }
    })}
  </ul>)
}

function renderTeamScores(props){
  let teamA = {players:[0,1,2,3,4], score:0, active:"inactive", answered:[]}
  let teamB = {players:[5,6,7,8,9], score:0, active:"inactive", answered:[]}

  props.data.players.forEach((player)=>{
    let calculatedScore = calculateScores(player.scores, props.data.round)
    
    player.scores.forEach((sc)=>{
      if(props.data.question && sc.id === props.data.questions[props.data.question].id){
        if(teamA.players.includes(player.id)){teamA.answered.push({player:player.id, answer: alphaOpts[sc.answer]});}
        if(teamB.players.includes(player.id)){teamB.answered.push({player:player.id, answer: alphaOpts[sc.answer]});}
      }
    })

    if(teamA.players.includes(player.active)){
      teamA.score = teamA.score+calculatedScore.round
      if(teamA.answered.length > 0 || props.data.test === player.active){teamA.active = "active"}
    }
    if(teamB.players.includes(player.active)){
      teamB.score = teamB.score+calculatedScore.round
      if(teamB.answered.length > 0 || props.data.test === player.active){teamB.active = "active"}
    }
  })

  return (
    <ul className="flex-container">
      <li className={"team "+teamA.active}>
        <span className="controller"></span>
        <span className="score">{teamA.answered.length > 0? teamA.answered.map((ans)=>{
          return <span className={"answered answered"+ans.player}><span>{ans.player}</span><span>{ans.answer}</span></span>
        }):teamA.score}</span>
        <span className="name">{props.data.options.TEAM_NAMES[0]}</span> 
      </li>
      <li className={"team "+teamB.active}>
        <span className="controller"></span>
        <span className="score">{teamB.answered.length > 0? teamB.answered.map((ans)=>{
          return <span className={"answered answered"+ans.player}><span>{ans.player}</span><span>{ans.answer}</span></span>
        }):teamB.score}</span>
        <span className="name">{props.data.options.TEAM_NAMES[1]}</span> 
      </li>
    </ul>
  )
}
function Scores(props){
    if(props.data.options.TEAM_MODE){
      return renderTeamScores(props)
    }else{
      return renderIndividualScores(props)
    }
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
    }else{
      return null;
    }
  })

  let addPlayer = null

  if(openController.length > 0){
    addPlayer = <div><select name="controller">
      {openController.map((oc)=>{
        return <option key={oc} value={oc}>{oc}</option>
      })}
      </select><input style={{width:"95%"}} type="submit" value="play"/></div>
  }

  return (
  <ul className="flex-container">
    {props.data.players.map(function(player, index){

        let playerClass = 'inactive'
        let calculatedScore = calculateScores(player.scores, props.data.round)

        if(player.active === false){
          return (<li key={player.id} className={"small " + playerClass}>
            
            <form onSubmit={(event)=>{
              event.preventDefault();
                player.active = parseInt(event.target[0].value)
                updatePlayer(player, index, props.data, props.setData)
            }}>{addPlayer}</form> 

            <span className="name">{player.id} [{calculatedScore.alltime}]</span>

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
