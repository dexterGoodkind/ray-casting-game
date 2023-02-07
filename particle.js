// can create multiple particles in the future

class Particle {
  constructor(x=width/2, y=height/2) {
    this.pos = createVector(x, y);  // put it in the centre
    this.rays = [];
    for (let i=0; i<360; i+=1) {
      const angle = radians(i);
      this.rays.push(new Ray(this.pos.x, this.pos.y, cos(angle), sin(angle))); 
    }
  }
  
  show() {
    fill(255); 
    ellipse(this.pos.x, this.pos.y, 10);   // draw particle
    
    // draw rays coming out:
    for (let ray of this.rays) {
      ray.show(); 
    }
  }
  
  look(walls, nonGhostLen) {
    // look at a specific walls
    let ghostWallsSeenIndices = []; 
    for (let ray of this.rays) {
      let nearestPt; 
      let smallestDist = Infinity;
      let wallsIdx; 
      for (i=0; i<walls.length; i++) {
        const wall = walls[i];
        const pt = ray.cast(wall);
        if (pt) {
          const dist = p5.Vector.dist(this.pos, pt); 
          if (dist < smallestDist) {
            smallestDist = dist; 
            nearestPt = pt; 
            wallsIdx = i; 
          }
        }
      }
      // now draw line to nearest wall
      if (nearestPt) {
        stroke(255, 100); // transparency
        line(this.pos.x, this.pos.y, nearestPt.x, nearestPt.y);
        
        // check if it's a ghost
        if (walls[wallsIdx].isGhost) {
          ghostWallsSeenIndices.push(wallsIdx);
        }
      }
      else {
        // console.log("NO NEAREST POINT");
      }
    }
    
    // after we've iterated through the rays, we want to find the correct ghosts to delete
    let ghostIndices = [];
    for (let ghostWallSeenIdx of ghostWallsSeenIndices) {
      const ghostIdx = Math.floor((ghostWallSeenIdx - nonGhostLen)/4); // since there are 4 walls to each ghost
      ghostIndices.push(ghostIdx); 
    }
    return ghostIndices; 
  }
  
  update(x, y) {
    this.pos.set(x, y);
  }
}