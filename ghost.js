class Ghost{
  constructor() {
    this.boundaryOffset = 10;
    this.speedDivisor = 2; 
    this.size = 30; 
    this.counter = 0; // counts how many steps it's been moving in the same direction
    this.dir = createVector(random(-1, 1), random(-1, 1));
    this.dir.normalize();
    this.dir.x /= this.speedDivisor; this.dir.y /= this.speedDivisor; 
    
    while (true) {
      this.pos = createVector(random(width), random(height));
      if (this.pos.x > this.boundaryOffset && this.pos.x < width-this.boundaryOffset && this.pos.y > this.boundaryOffset && this.pos.y < height - this.boundaryOffset) {
        break; 
      }
    }
    
    const x = this.pos.x; const y = this.pos.y;
    
    // make it a square with walls which are boundaries
    this.boundaries = [];
    this.boundaries.push(new Boundary(x-this.size/2, y+this.size/2, x-this.size/2, y-this.size/2, true)); // left
    this.boundaries.push(new Boundary(x-this.size/2, y-this.size/2, x+this.size/2, y-this.size/2, true)); // bottom
    this.boundaries.push(new Boundary(x+this.size/2, y-this.size/2, x+this.size/2, y+this.size/2, true)); // right
    this.boundaries.push(new Boundary(x+this.size/2, y+this.size/2, x-this.size/2, y+this.size/2, true)); // top
     
  }
  
  show() {
  //   fill('red'); 
  //   rect(this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size); // this is the hitbox
    image(ghost_img, this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size);
    // for (let boundary of this.boundaries) boundary.show();
  }
  
  isVisible(particle, mapWalls) { // walls shouldn't be the walls of the ghosts, just the walls of the map
    // here we're going through rays another time, so this is not optimal. 
    
    let allBoundaries = [...mapWalls]; 
    for (let boundary of this.boundaries) {
      allBoundaries.push(boundary); 
    }
    
    for (let ray of particle.rays) {
      let nearestPt; 
      let smallestDist = Infinity;
      let wallsIdx; 
      for (let i=0; i<allBoundaries.length; i++) {
        const wall = allBoundaries[i];
        const pt = ray.cast(wall);
        if (pt) {
          const dist = p5.Vector.dist(particle.pos, pt); 
          if (dist < smallestDist) {
            smallestDist = dist; 
            nearestPt = pt; 
            wallsIdx = i; 
          }
        }
      }
      // now check if it's a ghost
      if (nearestPt) {
        // check if it's a ghost
        if (allBoundaries[wallsIdx].isGhost) {
          return true;
        }
      }
      else {
        // console.log("NO NEAREST POINT");
      }
    }
    return false;  // if none of them are a ghost
  }
  
  move() { // create random movement of ghost.
    
    this.counter++; 
    // change direction:
    if (this.counter == 100) {
      this.counter = 0;
      this.dir = createVector(random(-1, 1), random(-1, 1));
      this.dir.normalize();
      this.dir.x /= this.speedDivisor; this.dir.y /= this.speedDivisor; 
    }
    
    let newXpos = this.pos.x + this.dir.x;
    let newYpos = this.pos.y + this.dir.y; 
    if (newXpos <= this.boundaryOffset) {
//       newXpos = this.boundaryOffset + 1;
      this.dir.x *= -1;
    }
    if (newXpos >= width - this.boundaryOffset) {
//       newXpos = width - this.boundaryOffset-1; 
      this.dir.x *= -1; 
    }
    if (newYpos <= this.boundaryOffset) {
//       newYpos = this.boundaryOffset+1;
      this.dir.y *= -1; 
    }
    if (newYpos >= height - this.boundaryOffset) {
//       newYpos = height - this.boundaryOffset-1;
      this.dir.y *= -1; 
    }
    
    // create new boundaries:
    this.pos = createVector(newXpos, newYpos); 
    const x = this.pos.x; const y = this.pos.y;
    this.boundaries = [];
    this.boundaries.push(new Boundary(x-this.size/2, y+this.size/2, x-this.size/2, y-this.size/2, true)); // left
    this.boundaries.push(new Boundary(x-this.size/2, y-this.size/2, x+this.size/2, y-this.size/2, true)); // bottom
    this.boundaries.push(new Boundary(x+this.size/2, y-this.size/2, x+this.size/2, y+this.size/2, true)); // right
    this.boundaries.push(new Boundary(x+this.size/2, y+this.size/2, x-this.size/2, y+this.size/2, true)); // top
    return this; 
  }
}
