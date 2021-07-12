import React, { useState } from 'react';

function SoundPlayer({src, onEnd, hide, max}){

  const [timer, updateTimer] = useState(1)

  let style = {
    audio:{display:"none"}
  }

  if(hide){
    style.display = "none"
  }

  if(onEnd === false){
    style.audio.display = "block"
  }

  return <span><audio style={style.audio} onEnded={onEnd} controls autoPlay onTimeUpdate={(e)=>{
    updateTimer(Math.round(e.target.currentTime+1))}}>
            <source src={src} type="audio/mpeg"/>
          Your browser does not support the audio element.
          </audio><progress style={style} id="player-elapse" max={max} value={timer}>{timer}</progress></span>
}

export default SoundPlayer;