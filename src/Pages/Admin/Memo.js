import React, { useState } from 'react';


function Memo({memo, updateMemo}){

  const [focus, setFocus] = useState(false);

  let styles={
    main:{
      position:"fixed",
      right:"15px",
      bottom:"15px",
      background:"white",
      margin:0,
      padding:0,
      zIndex:1000
    },
    memo:{
      display:"none",
      width:"500px",
      height:"300px",
      margin:0,
      padding:0,
      border:"solid 2px gray"
    },
    button:{
      position:"absolute",
      bottom:15,
      right:15
    }
  }

  if(focus){
    styles.memo.display = "block"
  }

  return (<div style={styles.main}><button style={styles.button} onClick={()=>{setFocus(!focus)}}>memo</button>
          <textarea style={styles.memo} name="memo" onChange={(e)=>{updateMemo(e)}} value={memo}></textarea>
        </div>  )
}

export default Memo;