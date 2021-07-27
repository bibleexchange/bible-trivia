import React from 'react';
import ImageMap from "../ImageMap";
import SoundPlayer from "../SoundPlayer"

function Editor({styles, question, updateQuestion, setQuestion, create,save, data, setData, clear, resetEditor}){
  let image = ''
  let audio = ''
  const questions = data.questions

  if(question.changed.image !== undefined && question.changed.image !== "" && question.changed.image.src !== ""){
    image = <ImageMap src={question.changed.image.src} coords={question.changed.image.coords} />
  }
  
  if(question.changed.audio !== undefined && question.changed.audio !== ""){
    audio = <SoundPlayer src={question.changed.audio} hide={false} onEnd={false}/>
  }

  const q = question.changed;

  return (<div className="admin-row">
    <ul className="admin-column" style={styles.editor}>
          <li>ID: <input style={styles.inputs} value={q.id?q.id:""} name="id" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>QUESTION: <input style={styles.inputs} value={q.question?q.question:""} name="question" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>SCRIPTURE: <input style={styles.inputs}  value={q.scripture?q.scripture:""} name="scripture" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>CHOICES: <input style={styles.inputs} value={q.choices?q.choices:[]} name="choices" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>TAGS: <input style={styles.inputs} value={q.tags?q.tags:""} name="tags" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>AUDIO: <input style={styles.inputs} value={q.audio?q.audio:""} name="audio" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>IMAGE SRC: <input style={styles.inputs} value={q.image?q.image.src:""} name="imgsrc" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>IMAGE TOP: <input style={styles.inputs} value={q.image?q.image.coords.top:""} name="imgtop" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>
          <li>IMAGE LEFT: <input style={styles.inputs} value={q.image?q.image.coords.left:""} name="imgleft" onChange={(e)=>{updateQuestion(e,question,setQuestion)}}/></li>

           <button onClick={()=>{create(question,setQuestion,data,setData)}}>create</button><button onClick={()=>{save(question,setQuestion,data,setData)}}>save</button>
           <button onClick={()=>{resetEditor(question, setQuestion,questions)}}>reset</button>
           <button onClick={()=>{clear(question,setQuestion,questions,setData)}}>clear</button>
        </ul>

        <div className="admin-column">{image} {audio}</div>

        </div> )
}

export default Editor;