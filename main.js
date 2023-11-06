
//create random bars using random numbers
const barAmt = 20;
const arr=[];
shuffle(); //automically call shuffle function w/o button click, so that content will always be displayed on screen
//randomly shuffle

let audioCtx=null; //audiocContext
let audio;
let gainNode;


function audioSetUp(){
    if (audioCtx===null){
        audioCtx = new (window.AudioContext || window.webkitAudiotContext)();
        const audioFilePath = './static/cartoon.mp3'; 
        // }

        audio = new Audio(audioFilePath);
        let audioElement = audioCtx.createMediaElementSource(audio);
        gainNode = audioCtx.createGain();
        audioElement.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    }
}

function soundAnimate(volume, time){
    return new Promise((resolve)=>{
        //createMediaElementSource: method of the AudioContext Interface is used to create a new MediaElementAudioSourceNode object, given an existing HTML <audio> or <video> element, the audio from which can then be played and manipulated.
        
        audio.volume = volume;
        audio.play();

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + time);
        // audioElement.connect(audioCtx.destination);
        // audio.play();
        audio.onended = resolve;
    });
}

function delay(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle(){
    
    for (let i=0; i<barAmt; i++){
        arr[i] = Math.random();//each arr element gets a random number
        // console.log(arr[i]);
    }
    barDisplay();
}
    
function sort(){
    audioSetUp();
    //create a new array by shallow copy so that original array value will not be affected
    //if I get movement from the original array, it will be sorted after bubbleSort call
    let arrCopy=[...arr];
    let mvm = bubbleSort(arrCopy);
    // barDisplay(); -- when I play this program, instead of showing bars statically, I need to animate it to
    //show the sorting visulazation effect.
    visualization(mvm);
}

//use do while, because I want the algo to run at least once at any condition
function bubbleSort(arr){
    let hasGoneThroughSwap;
    //in order to record the movement from each swap and display the animation, I need to record this movement
    let movement=[];
    do{
        //need a for loop to loop through entire array
        //need a loop to track how many times I have loop through the entire array to start over again
        hasGoneThroughSwap=false;
        for (let i=0; i<arr.length-1; i++){
            //at each round, check i+1's value is bigger than i's value, if yes, swap i+1 w. i 's value
            if (arr[i]>arr[i+1]) {//use "array destructuring" to swap element
                movement.push([i, i+1]);//add two element with index i and i+1 into movement array, so that
                                        //we can obtain the two element and animate it at each loop
                [arr[i],arr[i+1]]=[arr[i+1],arr[i]];
                //need a checkpoint to check once the entire is sorted, then I should stop continue the round
                hasGoneThroughSwap=true;    
                soundAnimate(0.8, 0.05);
            }
        }
    }while(hasGoneThroughSwap);

    soundAnimate(0, 0.05);
    return movement;
}


function barDisplay(twoBars){
//whenever I want to display the bar at each round, I need to empty the content, else previous bar content will
//also be left on the screen
    container.innerHTML="";
//display them as div, so it can be visualized 
    for (let i=0; i<arr.length; i++){
        let bar = document.createElement("div"); //shape the "bar" as an individual div
        bar.style.height=arr[i]*100 + '%'; //each bar should have random different height, hence we utilize the arr value arrr[i]
        bar.classList.add("barStyle");
        
        //there exist such two bars and the ith bar (the bar that is in currnt loop round), then change them to another color
        if(twoBars && twoBars.includes(i)) bar.style.backgroundColor="yellow";
        //let each bar be a div and append this div inside the container
        container.appendChild(bar);
    }
}

async function visualization(movement){
    //if there is nothing inside the movement[] log, that means the array never been sorted cuz it's already sorted
    if(movement.length===0) {
        barDisplay(); //if done with the sorting, display the way it is
        return;
    }
    const [i, j]=movement.shift();//extracting two values from the swaps array and assigning them to the variables i and j
                //.shift() method in JS: removes the first element in array, if call movement.shift() -- returns
                //the removed element. if call movement after method call, returns the array w/o the 1st element
                //although shift() indeed only returns the first element, but i and j here represent index and 
                //the relationship between i and j is i is a previous index of j
    //swap the two element
    [arr[i], arr[j]]=[arr[j], arr[i]];
    //after the swap, display the two bars again
    barDisplay([i, j]);
    //set a time interval of each movement
    setTimeout(function(){
        //at each interval, call visualization function again to animate the next two bars
        visualization(movement);
    },80);

    await soundAnimate(0.8, 0.05); //playsound when bar moves
    await delay(50);//delay before next move
    await visualization(movement);//constantly calling the next move

    await soundAnimate(0, 0.05); //no sound when complete sorting

}