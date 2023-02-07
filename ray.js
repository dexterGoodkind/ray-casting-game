let roundingErrorMargin = 1e-10; 

class Ray {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y);
    this.dir = createVector(vx, vy);
    this.dir.normalize(); // so that direction stays reasonable.
  }
  
  show() {
    stroke(255); 
    push();   // start new drawing style
    translate(this.pos.x, this.pos.y); // displace by this amount
    line(0, 0, this.dir.x * 10, this.dir.y * 10); // draw vector
    pop();  // reset the translate
  }
  
  cast(wall) {
    // see if ray intersects with wall
    
    let t; 
    let m;
    
    // first, test special cases
    if (wall.a.x == wall.b.x) {
      // vertical, m==inf
      t = (wall.a.x - this.pos.x) / this.dir.x; 
    } else {
      // calculate m
      m = (wall.a.y - wall.b.y) / (wall.a.x - wall.b.x);
      
      // deal with case where ray and wall are parallel
      if (m == (this.dir.y / this.dir.x)) return;
      
      t = (wall.a.y - this.pos.y + m*this.pos.x - m*wall.a.x) / (this.dir.y - m*this.dir.x); 
    }
    
    if (t <= 0) return; // then it hits the other way
    
    const x = this.pos.x + t*this.dir.x; 
    const y = this.pos.y + t*this.dir.y; 
    let pt = createVector(x, y); 
    
    // make sure it hits the wall:
    // NOTE: we have to account for rounding error in calculation
    if (x < min([wall.a.x, wall.b.x])-roundingErrorMargin) return;
    if (x > max([wall.a.x, wall.b.x])+roundingErrorMargin) return;
    if (y < min([wall.a.y, wall.b.y])-roundingErrorMargin) return;
    if (y > max([wall.a.y, wall.b.y])+roundingErrorMargin) return;
    
    // if it passes these tests, return pt
    return pt; 
  }
}