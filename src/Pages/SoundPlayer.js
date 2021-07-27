import React, { useState } from 'react';

function SoundPlayer({src, onEnd, hide, max,volume}){

  const [clock, updateClock] = useState(1)

  let style = {
    display:"block",
    audio:{display:"none"}
  }

  if(hide){
    style.display = "none"
  }

  if(onEnd === false){
    style.audio.display = "block"
  }

  if(!volume){
    volume=1
  }

  return <span><audio volume={volume} style={style.audio} onEnded={onEnd} controls autoPlay onTimeUpdate={(e)=>{
    updateClock(Math.round(e.target.currentTime+1))}}>
            <source src={src} type="audio/mpeg"/>
          Your browser does not support the audio element.
          </audio><progress style={style} id="player-elapse" max={max} value={clock}>{clock}</progress></span>
}

export default SoundPlayer;