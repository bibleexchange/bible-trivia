import React, { useState } from 'react';


function UploadQuestionForm(props){
  const [name, setName] = useState("");
  

  return ( <form>
                <input
          type="text"
          value={name}
          onChange={(e) => {e.preventDefault(); setName(e.target.value)}}
        />

        <input
          type="file"
          onChange={(e) => {e.preventDefault();
            if(e.target){ 
              setQuestions(e, props.setQuestions);
            }
          } }
        />
      </form>  )
}

function setQuestions(event, setFile){
  let reader = new FileReader();
  reader.onload = (e)=>{
      let str = e.target.result;
      let json = JSON.parse(str);
      setFile(json);
  };
  reader.readAsText(event.target.files[0]);
}

export default UploadQuestionForm;