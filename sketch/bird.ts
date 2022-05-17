//import {NeuralNetwork} from '@tensorflow/tfjs'
// const {NeuralNetwork}= require( 'toy-neural-network/lib/nn.js');
//import {NeuralNetwork} from 'toy-neural-network/lib/nn.js'

class Bird {
  y: number;
  x: number;
  gravity: number;
  lift: number;
  velocity: number;
  icon: any;
  width: number;
  height: number;
  brain: NeuralNetwork;
  score: number;
  fitness: number;
  constructor(brain?:NeuralNetwork) {
    this.y = height / 2;
    this.x = 64;

    this.gravity = 0.6;
    this.lift = -10;
    this.velocity = 0;

    this.score=0
    this.fitness=0

    this.brain=brain?brain.copy(): new NeuralNetwork(4,4,2)
    

    this.icon = birdSprite;
    this.width =(windowWidth+windowHeight)/30 ;
    this.height = (windowWidth+windowHeight)/30;
  }

  show() {
    // draw the icon CENTERED around the X and Y coords of the bird object
    image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  up() {
    this.velocity = this.lift;
  }

  think(pipes:Pipe[]){
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    let inputs :number[] =  []
    inputs[0]=(closest.x -this.x)/width
    inputs[1]=(this.y-closest.top)/height
    inputs[2]=(closest.bottom -this.y)/width
    inputs[3]=(-this.velocity)/10

    let output = this.brain.predict(inputs)
    //console.log(inputs,output)
    if (output[0]>output[1]) this.up()
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y >= height - this.height / 2) {
      this.y = height - this.height / 2;
      this.velocity = 0;
    }

    if (this.y <= this.height / 2) {
      this.y = this.height / 2;
      this.velocity = 0;
    }
  }
}