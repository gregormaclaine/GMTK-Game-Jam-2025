/**
 * Enemy AI with Advanced Pathfinding Integration
 * 
 * Uses the PathfindingGrid and AStarPathfinder classes from Pathfinding.js
 * to provide intelligent navigation around obstacles.
 */

class Enemy {
  static HEALTH_BAR_OFFSET = 20;

  constructor(image, pos, size) {
    this.image = image || null;
    this.pos = createVector(pos[0], pos[1]);
    this.size = size || (image ? [image.width, image.height] : [50, 50]);
    this.hitbox = new HitBox(pos, this.size);
    this.vel = createVector(0, 0);
    this.speed = 2;

    this.health = 10000;
    this.max_health = 10000;

    this.death_fade = 1;

    this.effects = [];
  }

  get deletable() {
    return this.health <= 0 && this.death_fade <= 0;
    
    // Pathfinding properties
    this.path = [];
    this.pathIndex = 0;
    this.lastTargetPos = null;
    this.pathfindingGrid = null;
    this.recalculatePathTimer = 0;
    this.maxRecalculateInterval = 30; // frames
    this.stuckTimer = 0;
    this.lastPos = this.pos.copy();
    this.arrivedAtCurrentTarget = false;
    this.losCheckDistance = 300; // Only check line of sight within this distance
    this.pathSmoothingEnabled = true;
  }

  hasLineOfSight(targetPos, obstacles) {
    // Create a temporary hitbox for line of sight checking
    const direction = p5.Vector.sub(targetPos, this.pos);
    const distance = direction.mag();
    const steps = Math.ceil(distance / 10); // Check every 10 pixels
    
    for (let i = 1; i <= steps; i++) {
      const checkPos = p5.Vector.lerp(this.pos, targetPos, i / steps);
      const checkHitbox = new HitBox([checkPos.x, checkPos.y], [this.size[0] * 0.8, this.size[1] * 0.8]);
      
      for (let obstacle of obstacles) {
        if (checkHitbox.is_colliding(obstacle.hitbox)) {
          return false;
        }
      }
    }
    return true;
  }

  smoothPath(path, grid) {
    if (path.length <= 2) return path;
    
    const smoothedPath = [path[0]];
    let current = 0;
    
    while (current < path.length - 1) {
      let furthest = current + 1;
      
      // Find the furthest point we can reach in a straight line
      for (let i = current + 2; i < path.length; i++) {
        const worldCurrent = grid.gridToWorld(path[current]);
        const worldTarget = grid.gridToWorld(path[i]);
        
        if (this.hasLineOfSight(createVector(worldTarget.x, worldTarget.y), grid.obstacles)) {
          furthest = i;
        } else {
          break;
        }
      }
      
      smoothedPath.push(path[furthest]);
      current = furthest;
    }
    
    return smoothedPath;
  }

  shouldRecalculatePath(targetPos) {
    // Recalculate if target moved significantly
    if (!this.lastTargetPos || p5.Vector.dist(this.lastTargetPos, targetPos) > 50) {
      return true;
    }
    
    // Recalculate periodically
    if (this.recalculatePathTimer <= 0) {
      return true;
    }
    
    // Recalculate if stuck
    if (p5.Vector.dist(this.pos, this.lastPos) < 1) {
      this.stuckTimer++;
      if (this.stuckTimer > 30) { // Stuck for half a second
        this.stuckTimer = 0;
        return true;
      }
    } else {
      this.stuckTimer = 0;
    }
    
    // Recalculate if we've reached our current target
    if (this.arrivedAtCurrentTarget) {
      return true;
    }
    
    return false;
  }

  update(player, map) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.update();
      if (!effect.showing) this.effects.splice(i, 1);
    }

    if (this.health <= 0) {
      this.death_fade -= 0.01;
      return;
    }

    if (!map || !map.obstacles) {
      this.vel.setMag(0);
      return;
    }

    // Initialize or update pathfinding grid
    if (!this.pathfindingGrid) {
      this.pathfindingGrid = new PathfindingGrid([map.size[0] || 3000, map.size[1] || 3000]);
      this.pathfindingGrid.setObstacles(map.obstacles);
    }

    this.recalculatePathTimer--;
    this.lastPos = this.pos.copy();

    // Check if we need to recalculate path
    if (this.shouldRecalculatePath(player.pos)) {
      this.calculateNewPath(player.pos, map.obstacles);
      this.lastTargetPos = player.pos.copy();
      this.recalculatePathTimer = this.maxRecalculateInterval;
      this.arrivedAtCurrentTarget = false;
    }

    // Get movement direction
    const direction = this.get_path_find_direction(player.pos, map.obstacles);
    this.vel = direction.setMag(this.speed);
    
    // Apply movement
    this.pos.add(this.vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
    
    // Handle collisions with obstacles
    map.obstacles.forEach(obstacle => {
      const offset = obstacle.hitbox.repel(this.hitbox);
      if (offset) {
        this.pos.add(offset);
        this.hitbox.set_pos([this.pos.x, this.pos.y]);
        // If we collide, recalculate path sooner
        this.recalculatePathTimer = Math.min(this.recalculatePathTimer, 5);
      }
    });
  }

  calculateNewPath(targetPos, obstacles) {
    const distanceToTarget = p5.Vector.dist(this.pos, targetPos);
    
    // Check for direct line of sight first (only if target is reasonably close)
    if (distanceToTarget < this.losCheckDistance && this.hasLineOfSight(targetPos, obstacles)) {
      this.path = [];
      return;
    }

    // Use A* pathfinding
    const startGrid = this.pathfindingGrid.worldToGrid(this.pos);
    const goalGrid = this.pathfindingGrid.worldToGrid(targetPos);

    // Ensure start position is walkable
    if (!this.pathfindingGrid.isWalkable(startGrid.x, startGrid.y)) {
      startGrid.x = Math.max(0, Math.min(this.pathfindingGrid.width - 1, startGrid.x));
      startGrid.y = Math.max(0, Math.min(this.pathfindingGrid.height - 1, startGrid.y));
      
      // Find nearest walkable cell
      let found = false;
      for (let radius = 1; radius <= 5 && !found; radius++) {
        for (let dx = -radius; dx <= radius && !found; dx++) {
          for (let dy = -radius; dy <= radius && !found; dy++) {
            const newX = startGrid.x + dx;
            const newY = startGrid.y + dy;
            if (this.pathfindingGrid.isWalkable(newX, newY)) {
              startGrid.x = newX;
              startGrid.y = newY;
              found = true;
            }
          }
        }
      }
    }

    // Ensure goal position is walkable
    if (!this.pathfindingGrid.isWalkable(goalGrid.x, goalGrid.y)) {
      goalGrid.x = Math.max(0, Math.min(this.pathfindingGrid.width - 1, goalGrid.x));
      goalGrid.y = Math.max(0, Math.min(this.pathfindingGrid.height - 1, goalGrid.y));
      
      // Find nearest walkable cell to target
      let found = false;
      for (let radius = 1; radius <= 10 && !found; radius++) {
        for (let dx = -radius; dx <= radius && !found; dx++) {
          for (let dy = -radius; dy <= radius && !found; dy++) {
            const newX = goalGrid.x + dx;
            const newY = goalGrid.y + dy;
            if (this.pathfindingGrid.isWalkable(newX, newY)) {
              goalGrid.x = newX;
              goalGrid.y = newY;
              found = true;
            }
          }
        }
      }
    }

    const gridPath = AStarPathfinder.findPath(this.pathfindingGrid, startGrid, goalGrid);
    
    if (gridPath.length > 0) {
      // Smooth the path to remove unnecessary waypoints
      let finalPath = gridPath;
      if (this.pathSmoothingEnabled) {
        finalPath = this.smoothPath(gridPath, this.pathfindingGrid);
      }
      this.path = finalPath.map(gridPos => this.pathfindingGrid.gridToWorld(gridPos));
      this.pathIndex = 0;
    } else {
      this.path = [];
    }

    if (
      player.sword.hitbox.is_colliding(this.hitbox) &&
      player.sword.swinging
    ) {
      this.take_damage(player.sword.damage);
    }
  }

  get_path_find_direction(target_pos, obstacles = []) {
    // Direct line of sight - go straight to target
    if (this.path.length === 0) {
      const direction = p5.Vector.sub(target_pos, this.pos);
      if (direction.mag() > 5) {
        return direction.normalize();
      } else {
        return createVector(0, 0);
      }
    }

    // Follow the calculated path
    if (this.pathIndex < this.path.length) {
      const currentTarget = createVector(this.path[this.pathIndex].x, this.path[this.pathIndex].y);
      const direction = p5.Vector.sub(currentTarget, this.pos);
      
      // Check if we've reached the current waypoint
      if (direction.mag() < 20) {
        this.pathIndex++;
        if (this.pathIndex >= this.path.length) {
          this.arrivedAtCurrentTarget = true;
          // Head directly to final target
          return p5.Vector.sub(target_pos, this.pos).normalize();
        }
        return this.get_path_find_direction(target_pos, obstacles);
      }
      
      return direction.normalize();
    }

    // Fallback - go directly to target
    return p5.Vector.sub(target_pos, this.pos).normalize();
  }

  take_damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      // Handle enemy death
    }
    const damage_effect = new DamageEffect(amount, this.pos.copy());
    this.effects.push(damage_effect);
    damage_effect.trigger();
  }

  draw_health() {
    if (this.health === this.max_health) return;
    push();
    fill('red');
    noStroke();
    rect(
      this.pos.x - this.size[0] / 2,
      this.pos.y - this.size[1] / 2 - Enemy.HEALTH_BAR_OFFSET,
      this.size[0],
      5
    );
    if (this.health >= 0) {
      fill('green');
      rect(
        this.pos.x - this.size[0] / 2,
        this.pos.y - this.size[1] / 2 - Enemy.HEALTH_BAR_OFFSET,
        (this.health / this.max_health) * this.size[0],
        5
      );
    }
    pop();
  }

  show() {
    if (this.death_fade <= 0) return;

    push();
    if (this.death_fade < 1) {
      tint(255, this.death_fade * 255);
    }
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);
    image(images['square'], 0, 0, this.size[0], this.size[1]);
    pop();

    this.effects.forEach(e => e.show());

    this.draw_health();
    this.hitbox.show();

    // Debug: Show path
    if (SHOW_HITBOXES && this.path.length > 1) {
      stroke('green');
      strokeWeight(2);
      noFill();
      beginShape();
      vertex(this.pos.x, this.pos.y);
      for (let i = this.pathIndex; i < this.path.length; i++) {
        vertex(this.path[i].x, this.path[i].y);
      }
      endShape();

      // Show current target
      if (this.pathIndex < this.path.length) {
        fill('red');
        noStroke();
        circle(this.path[this.pathIndex].x, this.path[this.pathIndex].y, 10);
      }
    }
  }
}
