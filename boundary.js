class Boundary {
  // will be straight lines (for now)
  constructor(x1, y1, x2, y2, isGhost=false) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2); 
    this.isGhost = isGhost;  // for boundaries of ghosts
  }
  
  show() {
    stroke(255); 
    line(this.a.x, this.a.y, this.b.x, this.b.y); 
  }
}