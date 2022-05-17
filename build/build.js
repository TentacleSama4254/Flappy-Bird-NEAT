var Bird = (function () {
    function Bird(brain) {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;
        this.score = 0;
        this.fitness = 0;
        this.brain = brain ? brain.copy() : new NeuralNetwork(4, 4, 2);
        this.icon = birdSprite;
        this.width = (windowWidth + windowHeight) / 30;
        this.height = (windowWidth + windowHeight) / 30;
    }
    Bird.prototype.show = function () {
        image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    };
    Bird.prototype.up = function () {
        this.velocity = this.lift;
    };
    Bird.prototype.think = function (pipes) {
        var closest = null;
        var record = Infinity;
        for (var i = 0; i < pipes.length; i++) {
            var diff = pipes[i].x - this.x;
            if (diff > 0 && diff < record) {
                record = diff;
                closest = pipes[i];
            }
        }
        var inputs = [];
        inputs[0] = (closest.x - this.x) / width;
        inputs[1] = (this.y - closest.top) / height;
        inputs[2] = (closest.bottom - this.y) / width;
        inputs[3] = (-this.velocity) / 10;
        var output = this.brain.predict(inputs);
        if (output[0] > output[1])
            this.up();
    };
    Bird.prototype.update = function () {
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
    };
    return Bird;
}());
function nextGenreration() {
    calculateFitness();
    for (var i = 0; i < TOTAL; i++) {
        birds[i] = pick();
    }
    deadBirds = [];
}
function pick() {
    var index = 0;
    var r = random(1);
    while (r > 0) {
        r = r - deadBirds[index].fitness;
        index++;
    }
    index--;
    var birdD = deadBirds[index];
    var child = new Bird(birdD.brain);
    child.brain.mutate(function (e) { return Math.random() * 2 - 1; });
    return child;
}
function calculateFitness() {
    var sum = 0;
    for (var _i = 0, deadBirds_1 = deadBirds; _i < deadBirds_1.length; _i++) {
        var bird_1 = deadBirds_1[_i];
        sum += bird_1.score;
    }
    for (var _a = 0, deadBirds_2 = deadBirds; _a < deadBirds_2.length; _a++) {
        var bird_2 = deadBirds_2[_a];
        bird_2.fitness = bird_2.score / sum;
    }
}
var Matrix = (function () {
    function Matrix(rows, cols) {
        var _this = this;
        this.rows = rows;
        this.cols = cols;
        this.data = Array(this.rows).fill(0).map(function () { return Array(_this.cols).fill(0); });
    }
    Matrix.prototype.copy = function () {
        var m = new Matrix(this.rows, this.cols);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                m.data[i][j] = this.data[i][j];
            }
        }
        return m;
    };
    Matrix.fromArray = function (arr) {
        return new Matrix(arr.length, 1).map(function (e, i) { return arr[i]; });
    };
    Matrix.subtract = function (a, b) {
        if (a.rows !== b.rows || a.cols !== b.cols) {
            console.log('Columns and Rows of A must match Columns and Rows of B.');
            return;
        }
        return new Matrix(a.rows, a.cols)
            .map(function (_, i, j) { return a.data[i][j] - b.data[i][j]; });
    };
    Matrix.prototype.toArray = function () {
        var arr = [];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    };
    Matrix.prototype.randomize = function () {
        return this.map(function (e) { return Math.random() * 2 - 1; });
    };
    Matrix.prototype.add = function (n) {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }
            return this.map(function (e, i, j) { return e + n.data[i][j]; });
        }
        else {
            return this.map(function (e) { return e + n; });
        }
    };
    Matrix.transpose = function (matrix) {
        return new Matrix(matrix.cols, matrix.rows)
            .map(function (_, i, j) { return matrix.data[j][i]; });
    };
    Matrix.multiply = function (a, b) {
        if (a.cols !== b.rows) {
            console.log('Columns of A must match rows of B.');
            return;
        }
        return new Matrix(a.rows, b.cols)
            .map(function (e, i, j) {
            var sum = 0;
            for (var k = 0; k < a.cols; k++) {
                sum += a.data[i][k] * b.data[k][j];
            }
            return sum;
        });
    };
    Matrix.prototype.multiply = function (n) {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }
            return this.map(function (e, i, j) { return e * n.data[i][j]; });
        }
        else {
            return this.map(function (e) { return e * n; });
        }
    };
    Matrix.prototype.map = function (func) {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    };
    Matrix.map = function (matrix, func) {
        return new Matrix(matrix.rows, matrix.cols)
            .map(function (e, i, j) { return func(matrix.data[i][j], i, j); });
    };
    Matrix.prototype.print = function () {
        console.table(this.data);
        return this;
    };
    Matrix.prototype.serialize = function () {
        return JSON.stringify(this);
    };
    Matrix.deserialize = function (data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        var matrix = new Matrix(data.rows, data.cols);
        matrix.data = data.data;
        return matrix;
    };
    return Matrix;
}());
if (typeof module !== 'undefined') {
    module.exports = Matrix;
}
var ActivationFunction = (function () {
    function ActivationFunction(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
    return ActivationFunction;
}());
var sigmoid = new ActivationFunction(function (x) { return 1 / (1 + Math.exp(-x)); }, function (y) { return y * (1 - y); });
var tanh = new ActivationFunction(function (x) { return Math.tanh(x); }, function (y) { return 1 - (y * y); });
var NeuralNetwork = (function () {
    function NeuralNetwork(in_nodes, hid_nodes, out_nodes) {
        var _this = this;
        this.predict = function (input_array) {
            var inputs = Matrix.fromArray(input_array);
            var hidden = Matrix.multiply(_this.weights_ih, inputs);
            hidden.add(_this.bias_h);
            hidden.map(_this.activation_function.func);
            var output = Matrix.multiply(_this.weights_ho, hidden);
            output.add(_this.bias_o);
            output.map(_this.activation_function.func);
            return output.toArray();
        };
        if (in_nodes instanceof NeuralNetwork) {
            var a = in_nodes;
            this.input_nodes = a.input_nodes;
            this.hidden_nodes = a.hidden_nodes;
            this.output_nodes = a.output_nodes;
            this.weights_ih = a.weights_ih.copy();
            this.weights_ho = a.weights_ho.copy();
            this.bias_h = a.bias_h.copy();
            this.bias_o = a.bias_o.copy();
        }
        else {
            this.input_nodes = in_nodes;
            this.hidden_nodes = hid_nodes;
            this.output_nodes = out_nodes;
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();
            this.bias_h = new Matrix(this.hidden_nodes, 1);
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();
        }
        this.setLearningRate();
        this.setActivationFunction();
    }
    NeuralNetwork.prototype.setLearningRate = function (learning_rate) {
        if (learning_rate === void 0) { learning_rate = 0.1; }
        this.learning_rate = learning_rate;
    };
    NeuralNetwork.prototype.setActivationFunction = function (func) {
        if (func === void 0) { func = sigmoid; }
        this.activation_function = func;
    };
    NeuralNetwork.prototype.train = function (input_array, target_array) {
        var inputs = Matrix.fromArray(input_array);
        var hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activation_function.func);
        var outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activation_function.func);
        var targets = Matrix.fromArray(target_array);
        var output_errors = Matrix.subtract(targets, outputs);
        var gradients = Matrix.map(outputs, this.activation_function.dfunc);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);
        var hidden_T = Matrix.transpose(hidden);
        var weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
        this.weights_ho.add(weight_ho_deltas);
        this.bias_o.add(gradients);
        var who_t = Matrix.transpose(this.weights_ho);
        var hidden_errors = Matrix.multiply(who_t, output_errors);
        var hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);
        var inputs_T = Matrix.transpose(inputs);
        var weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
        this.weights_ih.add(weight_ih_deltas);
        this.bias_h.add(hidden_gradient);
    };
    NeuralNetwork.prototype.serialize = function () {
        return JSON.stringify(this);
    };
    NeuralNetwork.deserialize = function (data1) {
        var data;
        if (typeof data1 == 'string') {
            data = JSON.parse(data1);
        }
        var nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = Matrix.deserialize(data.weights_ih);
        nn.weights_ho = Matrix.deserialize(data.weights_ho);
        nn.bias_h = Matrix.deserialize(data.bias_h);
        nn.bias_o = Matrix.deserialize(data.bias_o);
        nn.learning_rate = data.learning_rate;
        return nn;
    };
    NeuralNetwork.prototype.copy = function () {
        return new NeuralNetwork(this);
    };
    NeuralNetwork.prototype.mutate = function (func) {
        this.weights_ih.map(func);
        this.weights_ho.map(func);
        this.bias_h.map(func);
        this.bias_o.map(func);
    };
    return NeuralNetwork;
}());
var Pipe = (function () {
    function Pipe() {
        this.spacing = 300;
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = this.top + this.spacing;
        this.x = width;
        this.w = 80;
        this.speed = 3;
        this.passed = false;
        this.highlight = false;
    }
    Pipe.prototype.hits = function (bird) {
        var halfBirdHeight = bird.height / 2;
        var halfBirdwidth = bird.width / 2;
        if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
            if (bird.x + halfBirdwidth > this.x && bird.x - halfBirdwidth < this.x + this.w) {
                this.highlight = true;
                this.passed = true;
                return true;
            }
        }
        this.highlight = false;
        return false;
    };
    Pipe.prototype.pass = function (bird) {
        if (bird.x > this.x && !this.passed) {
            this.passed = true;
            return true;
        }
        return false;
    };
    Pipe.prototype.drawHalf = function () {
        var howManyNedeed = 0;
        var peakRatio = pipePeakSprite.height / pipePeakSprite.width;
        var bodyRatio = pipeBodySprite.height / pipeBodySprite.width;
        howManyNedeed = Math.round(height / (this.w * bodyRatio));
        for (var i = 0; i < howManyNedeed; ++i) {
            var offset = this.w * (i * bodyRatio + peakRatio);
            image(pipeBodySprite, -this.w / 2, offset, this.w, this.w * bodyRatio);
        }
        image(pipePeakSprite, -this.w / 2, 0, this.w, this.w * peakRatio);
    };
    Pipe.prototype.show = function () {
        push();
        translate(this.x + this.w / 2, this.bottom);
        this.drawHalf();
        translate(0, -this.spacing);
        rotate(PI);
        this.drawHalf();
        pop();
    };
    Pipe.prototype.update = function () {
        this.x -= this.speed;
    };
    Pipe.prototype.offscreen = function () {
        return (this.x < -this.w);
    };
    return Pipe;
}());
var TOTAL = 500;
var bird;
var birds = [];
var deadBirds = [];
var pipes = [];
var counter = 0;
var cycles = 100;
var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
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
    console.log('s');
    for (var i = 0; i < TOTAL; i++) {
        birds[i] = new Bird();
    }
    reset();
}
function draw() {
    image(bgImg, bgX, 0, bgImg.width, height);
    bgX -= pipes[0].speed * parallax;
    if (bgX <= -bgImg.width + width) {
        image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
        if (bgX <= -bgImg.width) {
            bgX = 0;
        }
    }
    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();
        for (var j = birds.length - 1; j >= 0; j--) {
            if (pipes[i].hits(birds[j])) {
                deadBirds.push(birds.splice(j, 1)[0]);
            }
        }
        if (pipes[i].pass(bird)) {
            score++;
        }
        if (birds.length === 0) {
            nextGenreration();
            pipes = [];
            var ppp = new Pipe();
            ppp.x = 1000;
            pipes.push(ppp);
            pipes.splice(1, 1);
            counter = 0;
        }
        counter++;
        if (pipes[i] && pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }
    for (var _i = 0, birds_1 = birds; _i < birds_1.length; _i++) {
        var bird_3 = birds_1[_i];
        bird_3.think(pipes);
        bird_3.update();
        bird_3.show();
    }
    if ((frameCount - gameoverFrame) % 150 == 0) {
        pipes.push(new Pipe());
    }
    showScores();
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
function touchStarted() {
    if (isOver)
        reset();
}
//# sourceMappingURL=build.js.map