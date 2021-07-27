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

  let choicesLength = data.questions[data.question].choices.length

  if(data.option === false){

    let newData = {...data}
    let option = 0
    
    if(!data.options.MULTIPLE_CHOICE){
      option = Math.floor(Math.random() * choicesLength);
    }
    
    newData.option = option;

    let setIntID = false

    setData(newData)

    setIntID = setInterval(function(){ 
      //console.log('next option running...')
      let newNewData = {...newData}
      option++;      
      
      if(choicesLength < (option+1)){
        console.log("next option stopping...", data)
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

const alphaOpts = ["A","B","C","D","E","F","G","H","I","J","K","L","M"]

function translateOption(question){
  let answerIndex = question.choices.length-1
  let indexOf = 0

  question.randomOptions.forEach((op,index)=>{
    if(op.index === answerIndex){indexOf = index}
  })

  return alphaOpts[indexOf]
}

function calculateScores(scores,round){
  if(scores.length <= 0){
    return {
      score:0, alltime:0,round:0
    }
  }

  let allTimeScore = Number(0)
  let roundScore = Number(0)
  let correct = 0

  scores.forEach(function(score){
    if(Math.sign(score.score) === 1){
      correct++;
    }
    allTimeScore += Number(score.score);
    if(score.round === round){
      roundScore +=score.score;
    }
  })

  let sc = Math.round(Number(allTimeScore)/correct)

  if(sc < 0){
    sc = 0
  }
  return {
    score: sc,
    alltime: allTimeScore,
    round:roundScore
  };
}

function saveAsFile(data, name, skipFile = false){
  
  if(!skipFile){
    var fileContent = JSON.stringify(data)
    var bb = new Blob([fileContent ], { type: 'text/plain' });
    var a = document.createElement('a');
    a.download = name + ".json";
    a.href = window.URL.createObjectURL(bb);
    a.click();
  }

  localStorage.setItem(name,JSON.stringify(data))
}

export {
  activateBuzzers,
  alphaOpts,
  calculateScores,
  playerHasNotAnsweredBefore,
  nextOption,
  getRandom,
  shuffleArray,
  saveAsFile,
  translateOption
}