
const TOTAL=500
var bird:Bird;

let birds:Bird[]=[]
let deadBirds:Bird[]=[]
let pipes:Pipe[]=[]

let counter =0
let cycles = 100
//let slider: p5.Element

var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite: p5.Image;
var pipeBodySprite: p5.Image;
var pipePeakSprite: p5.Image;
var bgImg: p5.Image;
var bgX:number;
var gameoverFrame = 0;
var isOver = false;
var touched = false;
var prevTouched = touched;


function preload() {
  pipeBodySprite = loadImage('./graphics/pillar.jpeg');
  pipePeakSprite = loadImage('./graphics/pillar.jpeg');
  birdSprite = loadImage('./graphics/p1.png');
  bgImg = loadImage('./graphics/b3.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log('s')
 // slider = createSlider(1,200,1)

  for (let i=0; i<TOTAL; i++){
    birds[i]= new Bird()
  }
  reset();
}

function draw() {

  // if (counter % 75==0){
  //   pipes.push(new Pipe())
  // }
  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    for (let j= birds.length-1;j>=0;j--){
      if (pipes[i].hits(birds[j])) {
        deadBirds.push(birds.splice(j,1)[0])
      }
    }

    if (pipes[i].pass(bird)) {
      score++;
    }

    if (birds.length===0) {
      //console.log(deadBirds)
      //console.log(birds)
      nextGenreration()
      pipes= []
      let ppp=new Pipe()
      ppp.x=1000
      pipes.push(ppp)
      //console.log(pipes)
      pipes.splice(1,1)
      counter =0

    }
counter ++
   
    // if (pipes[i].hits(bird)) {
    //   gameover();
    // }

    if (pipes[i] &&pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }


for (let bird of birds){

  bird.think(pipes);
  bird.update();
  bird.show();
}


//background(0);

// for (let bird of birds){
//   bird.show()
// }
// for (let pipe of pipes){
//   pipe.show()
// }

  if ((frameCount - gameoverFrame) % 150 == 0) {
    pipes.push(new Pipe());
  }

  showScores();

  // // touches is an list that contains the positions of all
  // // current touch points positions and IDs
  // // here we check if touches' length is bigger than one
  // // and set it to the touched var
  // touched = (touches.length > 0);

  // // if user has touched then make bird jump
  // // also checks if not touched before
  // if (touched && !prevTouched) {
  //   bird.up();
  // }

  // // updates prevTouched
  // prevTouched = touched;


}

function showScores() {
  textSize(32);
  text('score: ' + score, 1, 32);
  text('record: ' + maxScore, 1, 64);
}

function gameover() {
  textSize(64);
  textAlign(CENTER, CENTER);
  text('GAMEOVER', width / 2, height / 2);
  textAlign(LEFT, BASELINE);
  maxScore = max(score, maxScore);
  isOver = true;
  noLoop();
}

function reset() {
  isOver = false;
  score = 0;
  bgX = 0;
  pipes = [];
  bird = new Bird();
  pipes.push(new Pipe());
  gameoverFrame = frameCount - 1;
  loop();
}

// function keyPressed() {
//   if (key === ' ') {
//     bird.up();
//     if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
//   }
// }

function touchStarted() {
  if (isOver) reset();
}