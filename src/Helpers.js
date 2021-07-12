function playerHasNotAnsweredBefore(player, data){

  let hasNotAnsweredBefore = true

  player.scores.forEach((score)=>{
    if(score.id === data.question){
      hasNotAnsweredBefore = false
    }
  })

   return hasNotAnsweredBefore
}

function nextOption(data, setData){

  if(data.option === false){

    let newData = {...data}
    let option = 0
    
    if(!data.mc){
      option = Math.floor(Math.random() * 4);
    }
    
    newData.option = option;

    let setIntID = false

    setData(newData)

    setIntID = setInterval(function(){ 
      
      let newNewData = {...newData}
      option++;      
      
      if(newNewData.questions[newNewData.question].choices.length < (option+1)){
        option = false
        newNewData.stage = 3
        clearInterval(setIntID);
      }
      newNewData.option = option
      setData(newNewData)

    }, 5000);
  }
  
}

function activateBuzzers(data, setData){
  //not configured yet
  return true;
}

function getRandom(max){//4
  return Math.floor(Math.random() * max)
}

function shuffleArray(array){
  let newObject = {index:0,string:""}

  array = array.map((item, index)=>{
    newObject = {
      index:index,
      string:item
    }
    return newObject
  })

  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const alphpaOpts = ["A","B","C","D","E","F","G","H","I","J","K","L","M"]

function translateOption(question){
  let answerIndex = question.choices.length-1
  let indexOf = 0

  question.randomOptions.forEach((op,index)=>{
    if(op.index === answerIndex){indexOf = index}
  })

  return alphpaOpts[indexOf]
}

export {
  activateBuzzers,
  alphpaOpts,
  playerHasNotAnsweredBefore,
  nextOption,
  getRandom,
  shuffleArray,
  translateOption
}