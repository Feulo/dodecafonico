
const notes = {
    48: "C,",49: "^C,",50: "D,",51: "^D,",52: "E,",53: "F,",54: "^F,",55: "G,",56: "^G,",57: "A,",
    58: "^A,",59: "B,",60: "C",61: "^C",62: "D",63: "^D",64: "E",65: "F",66: "^F",67: "G",68: "^G",
    69: "A",70: "^A",71: "B",72: "c",73: "^c",74: "d",75: "^d",76: "e",77: "f",78: "^f",79: "g",
    80: "^g",81: "a",82: "^a",83: "b",84: "c'"
}


function isRepeated(newNote, sequence){
    for (const note of sequence){
        if ((newNote-note) % 12 == 0){return true}
        if (newNote > 84 || newNote < 48){return true;}
        if (Math.abs(newNote-sequence[0]) > 19){return true;}
    }
    return false;
}

function getSelectedIntervals(){
    let selected = [];
    const checked = document.querySelectorAll('div.controls input[type="checkbox"]:checked') 
    selected = Array.from(checked).map(x => parseInt(x.value))
    return selected;
}

function randomNumber(minimum, maximum){
    return Math.round( Math.random() * (maximum - minimum) + minimum);
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



function recursiveSequence(sequence, lastNote,intervals){
    if (sequence.length >= totalNotes - 1){
        return [...sequence, lastNote];
    }
        
    let intervalCandidates = [];
    for(const interval of intervals){
        let newNote = lastNote + interval;
        if (!isRepeated(newNote, sequence)){intervalCandidates.push(interval)};
    }

    shuffle(intervalCandidates); 

    while(intervalCandidates.length > 0){
        let interval = intervalCandidates.pop()
        let newSequence = recursiveSequence([...sequence, lastNote], lastNote + interval, intervals)
        if (newSequence.length >= totalNotes)
            return newSequence
    }

    return sequence
  
}

function createSequence(){
    let intervals = getSelectedIntervals()
    totalNotes = document.querySelector("#noteCount").value
    let lastNote = randomNumber(59, 77);
    let sequence = recursiveSequence([], lastNote, intervals)
    return sequence;
}

var soundString ;
var visualOptions;
var visualObjAnswer;
var visualObj;
var answer;
var totalNotes
var step;
var synthControl
var answerString
function load() {
    visualOptions = {  };
    soundString = `L: 1\n|$C|`
    visualObj = ABCJS.renderAbc("paper", soundString, visualOptions);
    if (ABCJS.synth.supportsAudio()) {
        var controlOptions = {
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayClock: true
        };
        synthControl = new ABCJS.synth.SynthController();
        synthControl.load("#audio", null, controlOptions);
        synthControl.disable(true);
        var midiBuffer = new ABCJS.synth.CreateSynth();
        midiBuffer.init({
            visualObj: visualObj[0],options: {}
        }).then(function () {
            synthControl.setTune(visualObj[0], true).then(function (response) {
            })
        });
    } else {
        console.log("audio is not supported on this browser");
    };
    generate()
    
}
function hideShowAnswer(){
     document.querySelector("#answer").classList.toggle("hiddenAnswer")
}
function generate(){
    step = 0
    answer = createSequence().map(x=>notes[x])
    answerString = `L: 1\n|${answer.join('|')}|`
    visualObjAnswer = ABCJS.renderAbc("answer", answerString, visualOptions )
    soundString = `L: 1\n|${answer[0]}/4${answer[1]}/2>|`
    visualObj = ABCJS.renderAbc("paper", soundString, visualOptions);
    synthControl.setTune(visualObj[0], true).then(function (response) {})
}
function nextNote(){
    step++
    if(step < totalNotes-1){
        soundString = `L: 1\n|${answer.slice(0,step).join('|')}|${answer[step]}/4${answer[step+1]}/2>|`
        visualObj = ABCJS.renderAbc("paper", soundString, visualOptions);
        synthControl.setTune(visualObj[0], true).then(function (response) {})
    } else {
        visualObj = ABCJS.renderAbc("paper", answerString, visualOptions);
        synthControl.setTune(visualObj[0], true).then(function (response) {})
        console.log("chegou no final!")
    }
}