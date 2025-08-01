/**
 * Advanced A* Pathfinding System for Enemy AI
 * 
 * Features:
 * - Grid-based A* pathfinding with diagonal movement support
 * - Line-of-sight optimization for direct paths when possible
 * - Path smoothing to prevent wall-hugging behavior
 * - Dynamic obstacle detection using existing HitBox system
 * - Performance optimizations with path caching and recalculation timers
 * - Stuck detection and recovery
 * - Debug visualization when SHOW_HITBOXES is enabled
 * 
 * Usage:
 * - Enemies automatically calculate and follow optimal paths to the player
 * - Takes into account all obstacles in the map
 * - Switches between direct movement and pathfinding based on line of sight
 * - Handles collisions with obstacles during movement
 */

class PathfindingGrid {
  constructor(mapSize, cellSize = 30) {
    this.cellSize = cellSize;
    this.width = Math.ceil(mapSize[0] / cellSize);
    this.height = Math.ceil(mapSize[1] / cellSize);
    this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
    this.obstacles = [];
  }

  setObstacles(obstacles) {
    this.obstacles = obstacles;
    // Reset grid
    this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
    
    // Mark obstacle cells
    for (let obstacle of obstacles) {
      this.markObstacle(obstacle);
    }
  }

  markObstacle(obstacle) {
    const padding = 10; // Extra padding around obstacles
    const left = Math.max(0, Math.floor((obstacle.pos.x - obstacle.size[0]/2 - padding) / this.cellSize));
    const right = Math.min(this.width - 1, Math.floor((obstacle.pos.x + obstacle.size[0]/2 + padding) / this.cellSize));
    const top = Math.max(0, Math.floor((obstacle.pos.y - obstacle.size[1]/2 - padding) / this.cellSize));
    const bottom = Math.min(this.height - 1, Math.floor((obstacle.pos.y + obstacle.size[1]/2 + padding) / this.cellSize));

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        this.grid[y][x] = 1; // Mark as obstacle
      }
    }
  }

  worldToGrid(worldPos) {
    return {
      x: Math.floor(worldPos.x / this.cellSize),
      y: Math.floor(worldPos.y / this.cellSize)
    };
  }

  gridToWorld(gridPos) {
    return {
      x: gridPos.x * this.cellSize + this.cellSize / 2,
      y: gridPos.y * this.cellSize + this.cellSize / 2
    };
  }

  isWalkable(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] === 0;
  }

  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, // Cardinal
      {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1} // Diagonal
    ];

    for (let dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;
      
      if (this.isWalkable(newX, newY)) {
        // For diagonal moves, check if path is clear
        if (dir.x !== 0 && dir.y !== 0) {
          if (this.isWalkable(node.x + dir.x, node.y) && this.isWalkable(node.x, node.y + dir.y)) {
            neighbors.push({x: newX, y: newY});
          }
        } else {
          neighbors.push({x: newX, y: newY});
        }
      }
    }
    return neighbors;
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
          path.unshift(node);
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
        const tentativeGScore = (gScore.get(currentKey) || Infinity) + (isDiagonal ? Math.sqrt(2) : 1);

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