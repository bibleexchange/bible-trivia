import './Index.css';
import React, { useState } from 'react';
import {
  useParams
} from "react-router-dom";
import SynthEngine from './SynthEngine'
import OnscreenKeyboard from './OnscreenKeyboard'

const initialState = {
  downKeys: [],
  events: []
};

var keyList = [ 
  { number: 48, label: 'C'  },
  { number: 49, label: 'C#/Db'  },
  { number: 50, label: 'D'  },
  { number: 51, label: 'D#/Eb'  },
  { number: 52, label: 'E'  },
  { number: 53, label: 'F'  },
  { number: 54, label: 'F#'  },
  { number: 55, label: 'G'  },
  { number: 56, label: 'G#'  },
  { number: 57, label: 'A'  },
  { number: 58, label: 'A#/Bb'  },
  { number: 59, label: 'B'  },
  { number: 60, label: 'C'  }
];

function dispatch(state, action) {
  console.log(action.type)
  switch(action.type) {

    case 'NOTE_ON':
      state = Object.assign({}, state);
      state.downKeys.push(action.key);
      state.events.push(action);
      return state;
      
    case 'NOTE_OFF':
      state = Object.assign({}, state);
      state.downKeys = state.downKeys
        .filter(key => key !== action.key);
      state.events.push(action);
      return state;
      
    case 'PLAY_SCALE':
      state = Object.assign({}, state);
      state.downKeys.push('SCALE');
      state.events.push(action); 
      return state;

    case 'CLEAR_EVENT_QUEUE':
      state = Object.assign({}, state);
      state.events = [];

    default:
      return state;
  }
}

function Index() {

const [music, setMusic] = useState(initialState);

  const disp = (action)=>{
    const newState = dispatch(music,action)
    setMusic(newState)
  }

  return (
    <div className="Music">
      <SynthEngine music={music} dispatch={disp} events={music.events} keyList={keyList}/>
      <OnscreenKeyboard music={music} dispatch={disp} downKeys={music.downKeys} keyList={keyList}/>
    </div>
  );
}

export default Index;
