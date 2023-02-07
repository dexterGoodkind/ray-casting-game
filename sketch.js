// inspired by https://thecodingtrain.com/challenges/145-ray-casting-2d

let walls = [];   // boundary
let ghosts = []; 
let particle; 
let v = 2; 
let xpos; let ypos; 
let allWalls;
let score = 0; 
let newGhosts; 
let newGhost; 
let timer = 100; 

// load in ghost image:
var ghost_img; 
function preload() {
  ghost_img = loadImage('images/ghost.png');
}

function setup() {
  createCanvas(400, 400);
  frameRate(50);
  // create random boundaries:
  for (i=0; i<7; i++) {
    wall = new Boundary(random(5, width-5), random(5, height-5), random(5, width-5), random(5, height-5)); 
    walls.push(wall); 
  }
  // add walls around edges:
  walls.push(new Boundary(0, 0, width, 0)); // top
  walls.push(new Boundary(width, height, 0, height)); // bottom
  walls.push(new Boundary(0, 0, 0, height)); // left
  walls.push(new Boundary(width, 0, width, height)); // right
  
  xpos = width/2; ypos = height/2; 
  particle = new Particle(xpos, ypos);
  
  // create ghosts:
  for (i=0; i<1; i++) {
    const ghost = createNewGhost();
    ghosts.push(ghost);
  }
}

function draw() {
  background(0); 
  for (let wall of walls) wall.show();
  for (let ghost of ghosts) ghost.show();
  
  // add ghost walls
  allWalls = [...walls]; // copy array without reference
  for (let ghost of ghosts) {
    for (let boundary of ghost.boundaries) {
      allWalls.push(boundary);
    }
  }
  
  createMovedParticle(); 
  particle.show(); 
  const ghostIndices = particle.look(allWalls, walls.length);
  
  // now we remove the ghosts that we don't need
  newGhosts = []; 
  let ghostsToAdd = 0; 
  for (let i=0; i<ghosts.length; i++) {
    if (ghostIndices.includes(i)) {
      score += 1; 
      let newGhost; 
      newGhost = createNewGhost();  // pushes newGhost to newGhosts s.t. it's not in view of particle
      newGhosts.push(newGhost);
    } else {
      newGhost = ghosts[i].move();
      newGhosts.push(newGhost);
    }
  }
  
  ghosts = newGhosts; 
  
  fill('orange');
  textSize(20);
  
  if (frameCount % 50 == 0 && timer > 0) {
    timer--; 
  }
  
  if (timer == 0) {
    noLoop();
    background(0);
    if (score > 1) {
      text("Congratulations! You scored " + score + " points. Try refreshing the web page to play a different map!", 10, 100, 390);
    } else if (score == 1) {
      text("Congratulations! You scored " + score + " point. Try refreshing the web page to play a different map!", 10, 100, 390);
    } else if (score == 0) {
      text("Bad luck! You scored " + score + " points. Try refreshing the web page to play a different map!", 10, 100, 390);
    }
    
    image(ghost_img, width/2-50, 300, 100, 100);
  }
  else {
    text("Score: " + score, width/2+100, 10, 200, 50); 
    text("Time remaining: " + timer, 10, 10, 200, 50); 
  }
  
}


function createMovedParticle() {
 
  if (keyIsDown(LEFT_ARROW)) {
    xpos -= v; 
  }
  if (keyIsDown(RIGHT_ARROW)) {
    xpos += v; 
  }
  if (keyIsDown(UP_ARROW)) {
    ypos -= v; 
  }
  if (keyIsDown(DOWN_ARROW)) {
    ypos += v;
  }
  // check whether we're crossing a boundary
  // NOTE: this doesn't deal with the cases of 0 or infinite gradients. 
  // approach is to find the nearest distance from particle to line and reject the move if this is smaller than some threshold.
  for (i=0; i<walls.length-4; i++) {
    // don't need to worry about 4 outer walls as we do that below
    const wall = walls[i]; 
    const m_wall = (wall.a.y - wall.b.y) / (wall.a.x - wall.b.x); 
    const m_perp = - 1 / m_wall;
    
    const xIntersection = (wall.a.y - ypos + m_perp*xpos - m_wall*wall.a.x) / (m_perp - m_wall); 
    const yIntersection = ypos + m_perp * (xIntersection - xpos); 
    const intersection = createVector(xIntersection, yIntersection);
    // make sure it's part of the wall:
    if (intersection.x < min([wall.a.x, wall.b.x])-roundingErrorMargin) continue;
    if (intersection.x > max([wall.a.x, wall.b.x])+roundingErrorMargin) continue;
    if (intersection.y < min([wall.a.y, wall.b.y])-roundingErrorMargin) continue;
    if (intersection.y > max([wall.a.y, wall.b.y])+roundingErrorMargin) continue;
    const distToIntersection = p5.Vector.dist(intersection, createVector(xpos, ypos)); 
    if (distToIntersection < sqrt(2)) {
      // then reset position to what it was
      xpos = particle.pos.x; ypos = particle.pos.y; 
    }
  }
  
  if (xpos < 0) xpos = 0;
  if (ypos < 0) ypos = 0;
  if (xpos > width) xpos = width;
  if (ypos > height) ypos = height;
  particle = new Particle(xpos, ypos);
}

function createNewGhost() {
  while (true) { // keep refreshing until new ghost is outside view of particle. this is not the most efficient way of doing things. 
    newGhost = new Ghost(); 
    if (!newGhost.isVisible(particle, walls)) {
      return newGhost; 
    }
  }
}