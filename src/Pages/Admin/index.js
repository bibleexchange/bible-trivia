import './Index.css';
import React, { useState } from 'react';
import UploadJsonForm from '../../features/UploadJsonForm'
import Editor from './Editor'
import Memo from './Memo'
import {saveAsFile} from '../../Helpers'

import {
  Link
} from "react-router-dom";

const DB_FILE = 'bible-trivia-db';

const qTemplate = {
  original: JSON.stringify({
    question:"", 
    scripture:"", 
    choices:[], 
    tags:"",
    image:{src:"",coords:{top:"", left:""}},
    audio:""
  }),
  changed:{
    question:"", 
    scripture:"", 
    choices:[], 
    tags:"",
    image:{src:"",coords:{top:"", left:""}},
    audio:""
  }

}

function Index() {

const styles = {
  editor:{
    border:"solid 2px blue",
    marginLeft:"30px"
  },
  inputs:{
    width:"100%"
  }
}

const lData = localStorage.getItem(DB_FILE)
let storedData = {}

if(lData !== null){
  storedData = JSON.parse(lData)
}
const [data, setData] = useState({
  memo:"",
  questions:[],
  options:{},
  ...storedData
});

const [question, setQuestion] = useState({...qTemplate});

const questions = data.questions.reverse()//.slice(0).reverse()

  return (
    <div>
      <h1>Admin</h1>
      <button onClick={()=>{saveAsFile(data, DB_FILE)}}>store</button>
      <button onClick={()=>{saveAsFile(data, DB_FILE, true)}}>update local</button>

      <button className="small">LOAD QUESTIONS: <UploadJsonForm doWithResults={(json)=>{
          const newData = {...data, questions:[...json.questions], memo: json.memo}
          setData(newData)
          localStorage.setItem('bible-trivia-db',JSON.stringify(newData))
      }}/></button>

      <Memo memo={data.memo} updateMemo={(e)=>{
        updateMemo(e,data,setData)
      }}/>
        <hr />

      LOAD DATA:<UploadJsonForm doWithResults={setData}/>

      <div>
        <h1>{data.id} [{data.questions.length}]</h1>

        <Editor question={question} styles={styles} updateQuestion={updateQuestion} setQuestion={setQuestion} 
        create={create} save={save} data={data} setData={setData} clear={clear} resetEditor={resetEditor}/>

        <ul><h1>{questions.length}</h1>
          {questions.map((bibleQ)=>{
        
              let needsMoreChoices = ""
              let needsQuestion = ""
              let needsScripture = ""
              let needsTags = ""
              let hasImage = ""
              let hasAudio = ""
              let choicesIsArray = Array.isArray(bibleQ.choices)? "":"[NOT AN ARRAY]"

              if(bibleQ.choices.length < 2){
                needsMoreChoices = "[CHOICES:"+bibleQ.choices.length+"]"
              }

              if(bibleQ.tags === undefined || bibleQ.tags.length < 1){
                needsTags = "[TAGS_MISSING]"
              }

              if(bibleQ.question === "" || bibleQ.question === undefined){
                needsQuestion = "[QUESTION_MISSING]"
              }

              if(bibleQ.scripture === "" || bibleQ.scripture === undefined){
                needsScripture = "[SCRIPTURE_MISSING]"
              }

              if(bibleQ.audio !== undefined && bibleQ.audio !== ""){
                hasAudio = <img alt="Headphones" src="/img/audio.svg" style={{width:"15px"}}/>
              }

             if(bibleQ.image !== undefined && bibleQ.image.src !== undefined && bibleQ.image.src !== ""){
                hasImage = <img alt="cross" src="/img/image.svg" style={{width:"15px"}}/>
              }

                return <li key={bibleQ.id}><button onClick={()=>{
                  let newQ = {
                    ...qTemplate,
                    original: JSON.stringify({...bibleQ}),
                    changed: {...bibleQ}
                  }
                    setQuestion(newQ)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}>edit</button>
                  <Link to={"/speed-trivia/"+bibleQ.id}>VISIT</Link>{bibleQ.id} {bibleQ.question} {hasAudio} {hasImage} (options:{bibleQ.choices.length})<span style={{color:"red"}}>{choicesIsArray} {needsMoreChoices} {needsQuestion} {needsScripture} {needsTags}</span></li>
          })}


          
        </ul>
      </div>
    </div>
  );
}

function updateQuestion(e, question, setQuestion){

  let nQ = {...question}

  if(!nQ.changed.image){
    nQ.changed.image = {...JSON.parse(qTemplate.original).image}
  }

  switch(e.target.name){

    case 'question':
      nQ.changed.question = e.target.value
      break;
    case 'id':
      nQ.changed.id = e.target.value
      break;
    case 'scripture':
      nQ.changed.scripture = e.target.value
      break;
    case 'audio':
      nQ.changed.audio = e.target.value
      break;
    case 'choices':
      nQ.changed.choices = e.target.value.split(",")
      break;
    case 'tags':
      nQ.changed.tags = e.target.value
      break;
    case 'imgsrc':
      nQ.changed = {
        ...nQ.changed,
        image:{
          ...nQ.changed.image,
          src: e.target.value
        }
      }
      break;
    case 'imgtop':
      nQ.changed = {
        ...nQ.changed,
        image:{
          ...nQ.changed.image,
          coords: {
            ...nQ.changed.image.coords,
            top: e.target.value
          }
        }
      }
      break;
    case 'imgleft':
            nQ.changed = {
        ...nQ.changed,
        image:{
          ...nQ.changed.image,
          coords: {
            ...nQ.changed.image.coords,
            left: e.target.value
          }
        }
      }
      break;
    default:
      //
  }
  setQuestion(nQ)
}

function create(question,setQuestion,data,setData){
  let newData = {...data}
  let q = {...question.changed}

  q.id = data.questions.length

  newData.questions.push(q)
  setData(newData)

  setQuestion(qTemplate)
  localStorage.setItem('bible-questions',JSON.stringify(newData))
}

function save(question,setQuestion,data,setData){

  if(!question.changed.id){
    create(question,setQuestion,data,setData)
  }else{

    let newData = {...data}
    let q = {...question.changed}
    let qs = newData.questions.map((qu)=>{
      if(qu.id === q.id){
        qu = {...q}
      }

      return qu
    })
    newData.questions = qs
    setData(newData)

    setQuestion(question)
    localStorage.setItem(DB_FILE,JSON.stringify(newData))
  }

  
}

function clear(question,setQuestion,data,setData){
  setQuestion(qTemplate)
}

function updateMemo(e,data,setData){
  let newData = {...data}
  newData.memo = e.target.value
  setData(newData)
}

function resetEditor(question,setQuestion, questions){
  let nQ = {...question}
  nQ.original = {...questions[question.changed.id]}
  nQ.changed = {...questions[question.changed.id]}
  setQuestion(nQ)
}

export default Index;
