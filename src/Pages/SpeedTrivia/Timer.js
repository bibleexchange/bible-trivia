import React, { useState } from 'react';

function Timer(props){
  const [timer, setTimer] = useState(3)
  //setInterval(function(){ setTimer(timer-1); }, 2000);
  return (<span>{timer}</span>)
}

export default Timer;