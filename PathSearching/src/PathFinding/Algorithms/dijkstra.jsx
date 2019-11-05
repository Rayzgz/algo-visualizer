// returns the shortest path nodes in order
export default function dijkstra(grid, startNode, endNode) {
	const unvisited = [];
	const visitedInOrder = [];

	// initialize distance to infinity
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			unvisited.push(grid[i][j]);
		}
	}

	// distance to start node is 0
	startNode.distance = 0;

	// search for path
	while (unvisited.length > 0) {
		// the closest node from now
		const closestNode = getMinDistance(unvisited);

		// closest is a wall
		if (closestNode.isWall) {
			continue;
		}

		// distance is inf, no valid path, return empty array
		if (closestNode.distance === Infinity) {
			return visitedInOrder;
		}

		// mark this node as visited on the grid
		closestNode.visited = true;
		visitedInOrder.push(closestNode);

		// if this node is end node, the search is fnished, return the path
		if (
			closestNode.row === endNode.row &&
			closestNode.col === endNode.col
		) {
			return visitedInOrder;
		}

		// for all neighbors of the current node
		// add distance and mark predecessors
		const neighbors = getNeighbors(grid, closestNode);

		for (const neighbor of neighbors) {
			neighbor.distance = closestNode.distance + 1;
			neighbor.predecessor = grid[closestNode.row][closestNode.col];
		}
	}
}

function getNeighbors(grid, closestNode) {
	const neighbors = [];
	const row = closestNode.row;
	const col = closestNode.col;
	if (row > 0) {
		neighbors.push(grid[row - 1][col]);
	}
	if (row < grid.length - 1) {
		neighbors.push(grid[row + 1][col]);
	}
	if (col > 0) {
		neighbors.push(grid[row][col - 1]);
	}
	if (col < grid[0].length - 1) {
		neighbors.push(grid[row][col + 1]);
	}
	return neighbors.filter(neighbor => !neighbor.visited);
}

function getMinDistance(unvisited) {
	unvisited.sort((nodeA, nodeB) => nodeB.distance - nodeA.distance);
	const min = unvisited.pop();
	return min;
}
