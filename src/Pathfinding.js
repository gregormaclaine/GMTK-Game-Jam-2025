class PathfindingGrid {
  constructor(mapSize, cellSize = 80) {
    this.cellSize = cellSize;
    this.mapSize = mapSize;
    this.width = Math.ceil(mapSize[0] / cellSize);
    this.height = Math.ceil(mapSize[1] / cellSize);
    this.grid = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(0));
  }

  show() {
    stroke('yellow');
    strokeWeight(0.5);
    fill(0);
    for (let i = 0; i < this.width; i++)
      line(i * this.cellSize, 0, i * this.cellSize, this.mapSize[1]);

    for (let j = 0; j < this.height; j++)
      line(0, j * this.cellSize, this.mapSize[0], j * this.cellSize);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          fill(255, 0, 0, 100);
          circle(
            x * this.cellSize + this.cellSize / 2,
            y * this.cellSize + this.cellSize / 2,
            this.cellSize * 0.5
          );
        }
      }
    }
  }

  markObstacle(obstacle) {
    const left = Math.max(0, Math.floor(obstacle.pos.x / this.cellSize));
    const right = Math.min(
      this.width - 1,
      Math.floor((obstacle.pos.x + obstacle.size[0]) / this.cellSize)
    );
    const top = Math.max(0, Math.floor(obstacle.pos.y / this.cellSize));
    const bottom = Math.min(
      this.height - 1,
      Math.floor((obstacle.pos.y + obstacle.size[1]) / this.cellSize)
    );

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        this.grid[y][x] = 1; // Mark as obstacle
      }
    }
  }

  worldToGrid(worldPos) {
    return createVector(
      Math.floor(worldPos.x / this.cellSize),
      Math.floor(worldPos.y / this.cellSize)
    );
  }

  gridToWorld(gridPos) {
    return createVector(
      gridPos.x * this.cellSize + this.cellSize / 2,
      gridPos.y * this.cellSize + this.cellSize / 2
    );
  }

  isWalkable(x, y) {
    return (
      x >= 0 &&
      x < this.width &&
      y >= 0 &&
      y < this.height &&
      this.grid[y][x] === 0
    );
  }

  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 }, // Cardinal
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 } // Diagonal
    ];

    for (let dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;

      if (!this.isWalkable(newX, newY)) continue;

      // For diagonal moves, check if path is clear
      if (dir.x !== 0 && dir.y !== 0) {
        if (
          this.isWalkable(node.x + dir.x, node.y) &&
          this.isWalkable(node.x, node.y + dir.y)
        ) {
          neighbors.push({ x: newX, y: newY });
        }
      } else {
        neighbors.push({ x: newX, y: newY });
      }
    }
    return neighbors;
  }
}

class PathFinder {
  constructor(map) {
    this.map = map;
    this.path = null;
    this.is_direct = false;
  }

  hasLineOfSight(start, goal) {
    // Check if there's a direct line of sight to the target position
    const direction = p5.Vector.sub(goal, start);
    const distance = direction.mag();
    const steps = Math.ceil(distance / 10); // Check every 10 pixels

    for (let i = 1; i <= steps; i++) {
      const step_point = p5.Vector.lerp(start, goal, i / steps);
      for (let obstacle of this.map.obstacles) {
        if (obstacle.hitbox.contains_point(step_point)) return false;
      }
    }
    return direction.normalize();
  }

  get_direction(start, goal) {
    const direct_line = this.hasLineOfSight(start, goal);
    this.is_direct = !!direct_line;
    if (direct_line) {
      this.path = null;
      return direct_line;
    }

    const current_cell = this.map.path_grid.worldToGrid(start);
    if (this.map.path_grid.isWalkable(current_cell.x, current_cell.y)) {
      if (this.path) {
        // If you have made it to the next path point, remove it
        if (
          this.path[0].x === current_cell.x &&
          this.path[0].y === current_cell.y
        ) {
          this.path.shift();
        }
      }

      if (!this.path || this.path.length === 0) {
        this.path = AStarPathfinder.findPath(
          this.map.path_grid,
          current_cell,
          this.map.path_grid.worldToGrid(goal)
        );
      }

      // Go towards the next path point
      return p5.Vector.sub(
        this.map.path_grid.gridToWorld(this.path[0]),
        start
      ).normalize();
    }

    // If no direct line of sight and not on walkable cell, go direct to nearest walkable cell
    const neighbors = this.map.path_grid.getNeighbors(current_cell);
    if (!neighbors.length) return createVector(0, 0); // No neighbors, can't move
    return p5.Vector.sub(
      this.map.path_grid.gridToWorld(neighbors[0]),
      start
    ).normalize();
  }

  show() {
    if (this.path) {
      stroke('blue');
      strokeWeight(2);
      noFill();
      beginShape();
      for (let point of this.path) {
        const worldPoint = this.map.path_grid.gridToWorld(point);
        vertex(worldPoint.x, worldPoint.y);
      }
      endShape();
    }
  }
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  put(item, priority) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  get() {
    return this.elements.shift().item;
  }
}

class AStarPathfinder {
  static heuristic(a, b) {
    // Octile distance (accounts for diagonal movement)
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.sqrt(2) * Math.min(dx, dy) + Math.abs(dx - dy);
  }

  static findPath(grid, start, goal) {
    if (!grid.isWalkable(start.x, start.y))
      start = grid.getNeighbors(start)[0] || start;

    if (!grid.isWalkable(goal.x, goal.y))
      goal = grid.getNeighbors(goal)[0] || goal;

    const openSet = new PriorityQueue();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();

    const startKey = `${start.x},${start.y}`;
    const goalKey = `${goal.x},${goal.y}`;

    gScore.set(startKey, 0);
    openSet.put(start, this.heuristic(start, goal));

    // Limit pathfinding iterations to prevent infinite loops
    let iterations = 0;
    const maxIterations = 1000;

    while (!openSet.isEmpty() && iterations < maxIterations) {
      iterations++;
      const current = openSet.get();
      const currentKey = `${current.x},${current.y}`;

      if (currentKey === goalKey) {
        // Reconstruct path
        const path = [];
        let node = current;
        while (node) {
          path.unshift(createVector(node.x, node.y));
          node = cameFrom.get(`${node.x},${node.y}`);
        }
        return path;
      }

      closedSet.add(currentKey);

      const neighbors = grid.getNeighbors(current);
      for (let neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;

        if (closedSet.has(neighborKey)) continue;

        const isDiagonal = neighbor.x !== current.x && neighbor.y !== current.y;
        const tentativeGScore =
          (gScore.get(currentKey) ?? Infinity) +
          (isDiagonal ? Math.sqrt(2) : 1);

        if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeGScore);
          const fScore = tentativeGScore + this.heuristic(neighbor, goal);
          openSet.put(neighbor, fScore);
        }
      }
    }

    return []; // No path found
  }
}
