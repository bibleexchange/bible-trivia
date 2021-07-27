import React from 'react';

class SynthEngine extends React.Component {

componentWillMount() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this._playingNotes = [];
  }
  
  componentWillUnmount() {
    this.audioContext.close();
  }
  
  componentWillReceiveProps(props) {
       if (props.events.length) {
         props.events
         .forEach(this.processEvent.bind(this));
 
       props.dispatch({
      type: "CLEAR_EVENT_QUEUE"
      });
    }

  }

  processEvent(event) {
    switch(event.type) {
      case 'NOTE_ON':
        var osc = this.audioContext.createOscillator();
        osc.frequency.value = this.noteNumberToFrequency(event.key);
        osc.start(this.audioContext.currentTime);
        osc.type = 'sawtooth';
        osc.connect(this.audioContext.destination);
        this._playingNotes.push({
          key: event.key,
          osc
        })
        break;
      case 'NOTE_OFF':
        this._playingNotes.filter(note => {
          return note.key === event.key;
        }).forEach(note => {
          note.osc.stop(this.audioContext.currentTime);
        });
        break;

      case 'PLAY_SCALE':
        var osc = this.audioContext.createOscillator();

        this.props.keyList.map((item)=>{
          osc.frequency.value = this.noteNumberToFrequency(item.number);
          osc.start(this.audioContext.currentTime);
          osc.type = 'sawtooth';
          osc.connect(this.audioContext.destination);
          this._playingNotes.push({
            key: item.number,
            osc
          })
        })


        break;
    }
    
  }
  
  render() {
    return null;
  }
  
  noteNumberToFrequency(num) {
    // from https://github.com/danigb/midi-freq
    return Math.pow(2, (num - 69) / 12) * 440;
  }

}

export default SynthEngine