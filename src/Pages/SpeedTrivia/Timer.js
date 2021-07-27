import React, { useEffect, useState} from 'react';

function Timer({start, onEnd}){

  const [time, updateTime] = useState({
    seconds:start,
    running:true
  })

  useEffect(() => {
    const interval = setInterval(() => {

      if(time.running === false){
        //console.log('TIMER STARTED.', time.seconds)
          updateTime({
              seconds: start,
              running:true
          })

      }else if(time.seconds >= 1){

        //console.log('TIMER CONTINUED.', time.seconds-1)
          updateTime({
              seconds: time.seconds-1,
              running:true
          })
      }else{
        onEnd()
        clearInterval(interval);
        //console.log('TIMER ENDED.')
      }
    },1000);
   return () => clearInterval(interval); 
  });

  const width = (time.seconds/start)*100

  return (<div className="timer-progress" style={{height: width+"%"}}>{time.seconds}</div>)
}

export default Timer;