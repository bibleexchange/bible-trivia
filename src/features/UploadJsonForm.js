import React from 'react';


function UploadJsonForm({doWithResults}){  

  return ( <form>
        <input
          type="file"
          onChange={(e) => {e.preventDefault();
            if(e.target){ 
              readFile(e, doWithResults);
            }
          } }
        />
      </form>  )
}

function readFile(event, doWithResults){
  let reader = new FileReader();
  reader.onload = (e)=>{
      let str = e.target.result;
      let json = JSON.parse(str);
      console.log(json)
      doWithResults(json);
  };
  reader.readAsText(event.target.files[0]);
}

export default UploadJsonForm;