let spotCircleR = [30, 35, 40, 45, 50];// Set an aarry to hold the radius of the circle constitudeed by spots.
let spotR = 2;//Set the radius of the little spots.
let spacing = 2;//Set the spacing between each spot.
let patterns = [];// Set an aarry to store every patterns.
const hexagonSide = 68; //Set the side of the hexagon.
let song1, song2, song3, song4,song5,song6,song7,fft;//set the songs and fft
let playingPattern; 


function preload() {
    song1 = loadSound('assets/1.wav');
    song2 = loadSound('assets/2.wav');
    song3 = loadSound('assets/3.wav');
    song4 = loadSound('assets/4.wav');
    song5 = loadSound('assets/5.wav');
    song6 = loadSound('assets/6.wav');
    song7 = loadSound('assets/7.wav');
}
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  arrangePatterns();// Call the function to arrange the patterns.
  //Display the patterns.
  for (let pattern of patterns) {
    pattern.display();
  }
  fft = new p5.FFT()
}


// A class to create hexagon
class Hexagon {
  //The x and y decide the center point of the hexagon.
  //The side decide length of each side of the hexagon.
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  }


  display() {
    push();
    translate(this.x, this.y);
    stroke(42, 116, 17);
    strokeWeight(4);
    fill(52, 179, 90);
    rotate(PI / 2);//Rotate the hexagon 90° so that the sides of each hexagon can attach to sides of other hexagon.
    //Draw the hexagon
    //Reference from https://p5js.org/reference/#/p5/vertex
    beginShape();
    //calculate every vertices of the hexagon.
    for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 6) {
      let sx = cos(angle) * this.side;
      let sy = sin(angle) * this.side;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();
  }
}


class pattern {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.randomColor = color(random(255), random(255), random(255));
    this.coreColor = color(random(['#F51531', '#018221']));// These 2 colors extracted from the art 'Wheels of fortune'.
    this.spotCirclePositions = [];// Array to store positions of small circles.
    this.innerColors = this.generateInnerColors();//An array to store the colors for the 10 circle that radius between 30 and 50.
    this.spotOffsets = [];// array to stroe the position of spot 
    this.song = random([song1, song2, song3, song4,song5,song6,song7]); // random songs
    this.coreRadius = 5; // the radius of the core circle 

     //Calculate the positions of spots.
     for (let radius of spotCircleR) {
        //Calculate the circumference of the circle constitudeed by spots.
        let circumference = TWO_PI * radius;
        //calculate the number of spots.
        let numSpots = floor(circumference / (2 * spotR + spacing));
        for (let i = 0; i < numSpots; i++) {
          let angle = map(i, 0, numSpots, 0, TWO_PI);
          //caculate the position of spots.
          let x = cos(angle) * radius;
          let y = sin(angle) * radius;
          this.spotCirclePositions.push({ x, y });
          this.spotOffsets.push(0)//Initialize the offset of each point
        }
    }
        this.hexagon = new Hexagon(0, 0, hexagonSide);
}
generateInnerColors() {
    let colors = [];
    for (let i = 0; i < 10; i++) {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      let colorValue = color(r, g, b);
      colors.push(colorValue);
    }
    return colors;
 }


  
 
  update(spectrum) {
    for (let i = 0; i < this.spotOffsets.length; i++) {
      this.spotOffsets[i] = map(spectrum[i % spectrum.length], 0, 255, -10, 10);
    }
    let total = 0;
    for (let i = 0; i < spectrum.length; i++) {
        total += spectrum[i];
    }
    let averageLevel = total / spectrum.length;
    this.coreRadius = map(averageLevel, 0, 255, 5, 60);
  }

  display() {
    push();
    translate(this.x, this.y);
    //Generate the hexagons in the bottom.
    this.hexagon.display();


    //Generate the biggest circle.
    noStroke();
    fill(0);
    ellipse(0, 0, 110, 110);


    //Generate the spots.
    for (let i = 0; i < this.spotCirclePositions.length; i++) {
        let pos = this.spotCirclePositions[i];
        let offset = this.spotOffsets[i];
        fill(this.randomColor);
        noStroke();
        ellipse(pos.x, pos.y + offset, spotR * 2, spotR * 2);
      }
  
      fill(this.randomColor);
      ellipse(0, 0, 50, 50);

    // Generate the 10 circle that radius between 30 and 50.
    for (let i = 0; i < 10; i++) {
      let radius = random(30, 50);
      fill(this.innerColors[i]);
      ellipse(0, 0, radius, radius);
    }


    // Generate the core circles.
    // The colors of core circles extracted from the art 'Wheels of fortune'.
    fill(0);
    ellipse(0, 0, 30, 30);
    fill(this.coreColor);
    ellipse(0, 0, 20, 20);
    fill(255);
    ellipse(0, 0, 10, 10);
    pop();
  }
     isMouseOver() {
    //referece from https://p5js.org/reference/#/p5/dist
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < 55; //determine the position of the mouse
  }
//check the song 
    pauseSong() {
    if (this.song.isPlaying()) {
      this.song.pause();
    }
  }
}


//Make the canvas change according to the window size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  arrangePatterns();
  background(0);
  for (let pattern of patterns) {
    pattern.display();
  }
}


//It alternates the horizontal offset for each row to create a honeycomb arrangement of patterns.
function arrangePatterns() {
  patterns = [];
  let yOffset = 0;
  let alternate = false;
  while (yOffset < height + 55) {
    let xOffset;
    //According to alternate, if alternate is true, xOffset = 110. If alternate is false, xOffset = 50.
    if (alternate) {
      xOffset = 110;
    } else {
      xOffset = 50;
    }


    for (let x = -xOffset; x < width + 55; x += 120) {
      patterns.push(new pattern(x, yOffset));
    }
    yOffset += 104;
    alternate = !alternate;
  }
}

//
function draw() {
    if (playingPattern) {
      let spectrum = fft.analyze();
      playingPattern.update(spectrum);
    }
    for (let pattern of patterns) {
      pattern.display();
    }
  }

// if click the pattern, the song will play
function mousePressed() {
    for (let pattern of patterns) {
        //Check the current mouse position 
      if (pattern.isMouseOver()) {
        if (playingPattern && playingPattern.song.isPlaying()) {
          playingPattern.song.stop();
        }
        pattern.song.loop();//Starts looping the song
        playingPattern = pattern;
        break;
      }
    }
  }

//if press the 'space' the song will be paused 
function keyPressed() {
    if (key === ' ') {
      for (let pattern of patterns) {
        pattern.pauseSong();
      }
      if (playingPattern) {
        playingPattern = null; 
      }
    }
  }
  
