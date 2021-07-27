import React, {useRef, useEffect } from 'react';

function randomColor(){
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return "rgba("+r+","+g+","+b+",.5)"
}

function RandomImage(props) {

  const canvasRef = useRef(null)

  const canvasStyle={
    padding:0
  }

  const pixels=[
    {x:0,y:0,w:66,h:100, color:randomColor()},
    {x:0,y:100,w:66,h:100, color:randomColor()},
    {x:0,y:200,w:66,h:100, color:randomColor()},

    {x:65,y:0,w:66,h:100, color:randomColor()},
    {x:65,y:100,w:66,h:100, color:randomColor()},
    {x:65,y:200,w:66,h:100, color:randomColor()},

    {x:131,y:0,w:66,h:100, color:randomColor()},
    {x:131,y:100,w:66,h:100, color:randomColor()},
    {x:131,y:200,w:66,h:100, color:randomColor()}
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    //Our first draw

    pixels.forEach((pix)=>{
      ctx.fillStyle = pix.color;
      ctx.fillRect(pix.x,pix.y,pix.w,pix.h);
    })

  }, [])

  return (<canvas id="randomImage" width="198" height="300" style={canvasStyle} ref={canvasRef} {...props}>
    Your browser does not support the canvas element.
    </canvas>)
}

export default RandomImage;