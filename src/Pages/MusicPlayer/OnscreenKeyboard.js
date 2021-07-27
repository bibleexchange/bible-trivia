import React from 'react';

class OnscreenKeyboard extends React.Component {
  render() {
    const {
      downKeys,
      music,
      keyList
    } = this.props;

    return <div
      className="onscreen-keyboard"
    >
      {keyList.map(function(key) {
        return (<button
          key={key.number}
          onMouseDown={this.mouseDown.bind(this, key.number)}
          
          onMouseUp={this.mouseUp.bind(this, key.number)}

          className={downKeys.indexOf(key.number) !== -1
            ? 'down' : ''}
        >
          {key.label}
        </button>);
      }.bind(this))}

      <button onMouseDown={this.mouseDown2.bind(this, 'PLAY_SCALE')}>
        SCALE
      </button>
    </div>
  }
  
  mouseDown(key) {
    this.props.dispatch({
      type: 'NOTE_ON',
      key
    });
  }
  
  mouseUp(key) {
    this.props.dispatch({
      type: 'NOTE_OFF',
      key
    });
  }

  mouseDown2(name) {
    this.props.dispatch({
      type: name
    });
  }

}

export default OnscreenKeyboard;