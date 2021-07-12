function ImageMap({src, coords}){

  let co = {
    top:coords.top+"px",
    left:coords.left+"px",
  }

  if(coords.top === "" || coords.left === ""){
    co = {
      display:"none"
    }
  }
  
  return <div id="question-map">
      <img src={src} alt="Question Map"/>
      <p style={co}>X</p>
    </div>
}

export default ImageMap;