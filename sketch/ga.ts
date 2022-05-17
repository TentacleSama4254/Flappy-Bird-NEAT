function nextGenreration(){
    calculateFitness()
    for(let i=0;i<TOTAL;i++){
birds[i] =pick()
    }
deadBirds=[]
}



function pick(){
    let index= 0
    let r = random (1)
    while (r>0){
        r=r-deadBirds[index].fitness
        index++
    }
    index--
let birdD=deadBirds[index]
let child = new Bird(birdD.brain)
child.brain.mutate((e:any) => Math.random() * 2 - 1)
return child
}

// function poolSelection(birds) {
//     let index = 0;
//     // Pick a random number between 0 and 1
//     let r = random(1);
//     // Keep subtracting probabilities until you get less than zero
//     // Higher probabilities will be more likely to be fixed since they will
//     // subtract a larger number towards zero
//     while (r > 0) {
//       r -= birds[index].fitness;
//       // And move on to the next
//       index += 1;
//     }
// }

function calculateFitness(){
    let sum=0 
    for (let bird of deadBirds){
        sum+=bird.score
    }
    for (let bird of deadBirds){
        bird.fitness=bird.score/sum
    }
}