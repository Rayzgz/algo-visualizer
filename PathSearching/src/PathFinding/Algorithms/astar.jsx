
export default function astar(grid, startNode, endNode) {
    const open = [];
    const visitedInOrder = [];

    // NOTE: distance = (distance from start to cur) + (heuristic from cur to end) 
    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, endNode);
    startNode.cost = 0 + startNode.heuristic;
    open.push(startNode);

    while(open.length > 0){

        // the node with lowest cost
        const closestNode = getMinCost(open);

        // closest is a a wall 
        if(closestNode.isWall) {
            continue;
        }

        // distance is inf, no valid path, return empty array
		if (closestNode.cost === Infinity) {
            return visitedInOrder;
		}

		// put this node to closed list
		closestNode.visited = true;
        visitedInOrder.push(closestNode);
        

        // found end, finish with search
        if (
			closestNode.row === endNode.row &&
			closestNode.col === endNode.col
		) {
			return visitedInOrder;
		}

        // generate successors
        const neighbors = getNeighbors(grid, closestNode);


        // for each successor, determine if they should be on open list
		for (const neighbor of neighbors) {
			const g = closestNode.distance + heuristic(closestNode, neighbor);
            
            // not on open list, add it to open list
            // record f,g,h
            if (open.includes(neighbor)) {    // on open already
                if(neighbor.distance <= g){
                    continue;
                }
            }

            neighbor.predecessor = closestNode;
            neighbor.distance = g;
            neighbor.heuristic = heuristic(neighbor, endNode);
            neighbor.cost = g + neighbor.heuristic;
            open.push(neighbor);
        }
        


    }

    return visitedInOrder;
}

function getMinCost(list) {
	list.sort((nodeA, nodeB) => nodeB.cost - nodeA.cost);
	const min = list.pop();
	return min;
}


function heuristic(node, endNode){
    return Math.abs(endNode.row - node.row) + Math.abs(endNode.col - node.col);
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
    return neighbors.filter(neighbor => (!neighbor.visited || neighbor.isWall));
}