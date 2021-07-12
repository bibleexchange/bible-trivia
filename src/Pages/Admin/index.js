import './Index.css';
import React, { useState } from 'react';
import Navigation from '../Navigation'
import UploadQuestionsForm from './UploadQuestionsForm'
import Editor from './Editor'
import Memo from './Memo'

import {
  Link
} from "react-router-dom";

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

const [questions, setQuestions] = useState({memo:"",questions:[]});
const [question, setQuestion] = useState({...qTemplate});
const [search, setSearch] = useState("");

  return (
    <div>
      <h1>Admin</h1>
      <button onClick={()=>{store(questions)}}>store</button>
      <Memo memo={questions.memo} updateMemo={(e)=>{
        updateMemo(e,questions,setQuestions)
      }}/>
        <hr />

      <UploadQuestionsForm setQuestions={setQuestions}/>

      <div>
        <h1>{questions.id} [{questions.questions.length}]</h1>

        <Editor question={question} styles={styles} updateQuestion={updateQuestion} setQuestion={setQuestion} 
        create={create} save={save} questions={questions} setQuestions={setQuestions} clear={clear} resetEditor={resetEditor}/>

        <input value={search} onChange={(e)=>{setSearch(e.target.value)}} />

        <ul>
          {questions.questions.slice(0).reverse().map((bibleQ)=>{
        
              let needsMoreChoices = ""
              let needsQuestion = ""
              let needsScripture = ""
              let needsTags = ""
              let hasImage = ""
              let hasAudio = ""
              let choicesIsArray = Array.isArray(bibleQ.choices)? "":"[NOT AN ARRAY]"
              let test1 = false

              if(bibleQ.tags){
                test1 = bibleQ.tags.includes(search)
              }

              if(bibleQ.choices.length < 4){
                needsMoreChoices = "[CHOICES:"+bibleQ.choices.length+"]"
              }

              if(bibleQ.tags == undefined || bibleQ.tags.length < 1){
                needsTags = "[TAGS_MISSING]"
              }

              if(bibleQ.question == "" || bibleQ.question == undefined){
                needsQuestion = "[QUESTION_MISSING]"
              }

              if(bibleQ.scripture == "" || bibleQ.scripture == undefined){
                needsScripture = "[SCRIPTURE_MISSING]"
              }

              if(bibleQ.audio !== undefined && bibleQ.audio !== ""){
                hasAudio = <img src="/img/audio.svg" style={{width:"15px"}}/>
              }

             if(bibleQ.image !== undefined && bibleQ.image.src !== undefined && bibleQ.image.src !== ""){
                hasImage = <img src="/img/image.svg" style={{width:"15px"}}/>
              }

              if(test1 || bibleQ.question.includes(search)){
                return <li key={bibleQ.id} onClick={()=>{
                  let newQ = {
                    ...qTemplate,
                    original: JSON.stringify({...bibleQ}),
                    changed: {...bibleQ}
                  }
                    setQuestion(newQ)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}>{bibleQ.id} {bibleQ.question} {hasAudio} {hasImage}<span style={{color:"red"}}>{choicesIsArray} {needsMoreChoices} {needsQuestion} {needsScripture} {needsTags}</span></li>
            }else{
              return null
            }
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
    localStorage.setItem('bible-questions',JSON.stringify(newData))
  }

  
}

function clear(question,setQuestion,data,setData){
  setQuestion(qTemplate)
}

function store(data){
  var fileContent = JSON.stringify(data)
  var bb = new Blob([fileContent ], { type: 'text/plain' });
  var a = document.createElement('a');
  a.download = data.id + ".json";
  a.href = window.URL.createObjectURL(bb);
  a.click();

  localStorage.setItem('bible-questions',JSON.stringify(data.questions))
}

function updateMemo(e,data,setData){
  let newData = {...data}
  newData.memo = e.target.value
  setData(newData)
}

function resetEditor(question,setQuestion, questions){

  let nQ = {...question}
  nQ.original = {...questions.questions[question.changed.id]}
  nQ.changed = {...questions.questions[question.changed.id]}
  setQuestion(nQ)
}

export default Index;
