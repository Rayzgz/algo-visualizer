import { getMinDistance, getNeighbors } from './dijkstra';

export default function astar(grid, startNode, endNode) {
    const unvisited = [];
    const visitedInOrder = [];


    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            unvisited.push(grid[i][j]);
        }
    }


    // NOTE: distance = (distance from start to cur) + (heuristic from cur to end) 
    startNode.distance = 0;

    while( unvisited.length > 0){
        // the node with lowest cost(called distance in this case)
        const closestNode = getMinDistance(unvisited);

        // closest is a awall 
        if(closestNode.isWall) {
            continue;
        }

        // distance is inf, no valid path, return empty array
		if (closestNode.distance === Infinity) {
			return visitedInOrder;
		}

		// mark this node as visited on the grid
		closestNode.visited = true;
        visitedInOrder.push(closestNode);
        

        if (
			closestNode.row === endNode.row &&
			closestNode.col === endNode.col
		) {
			return visitedInOrder;
		}

        const neighbors = getNeighbors(grid, closestNode);

		for (const neighbor of neighbors) {
			neighbor.distance = closestNode.distance + heuristic(closestNode, neighbor) + heuristic(neighbor, endNode);
			neighbor.predecessor = grid[closestNode.row][closestNode.col];
		}

    }
}

function heuristic(node, endNode){
    return Math.abs(endNode.row - node.row) + Math.abs(endNode.col - node.col);
}