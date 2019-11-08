import React, { Component } from "react";
import { NodeBox } from "./Node/NodeBox";
import dijkstra from "./Algorithms/dijkstra";
import astar from "./Algorithms/astar";

import "./Grid.css";

export class Node {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.start = false;
		this.end = false;
		this.visited = false;
		this.animating = false;
		this.inShortestPath = false;
		this.isWall = false;
		this.predecessor = undefined;
		this.distance = Infinity;
		this.heuristic = Infinity;
		this.cost = Infinity;
	}
}

export default class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: [],
			startNode: {},
			endNode: {},
			shortestPath: [],
			mousePressing: false
		};
	}

	constructPath() {
		const path = [];
		let cur = this.state.endNode;
		while (cur.predecessor !== undefined) {
			path.push(cur);
			cur = cur.predecessor;
		}
		return path.reverse();
	}

	animatePath() {
		const path = this.constructPath();
		document.getElementById(
			`node-${this.state.startNode.row}-${this.state.startNode.col}`
		).className = "node node";
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.startNode.row}-${this.state.startNode.col}`
			).className = "node node-start";
		}, 20);

		for (let i = 0; i < path.length; i++) {
			const node = path[i];
			if (
				(node.row === this.state.startNode.row &&
					node.col === this.state.startNode.col) ||
				(node.row === this.state.endNode.row &&
					node.col === this.state.endNode.col)
			) {
				continue;
			}
			setTimeout(() => {
				document.getElementById(
					`node-${node.row}-${node.col}`
				).className = "node node-path";
			}, 20 * i);
		}

		setTimeout(() => {
			document.getElementById(
				`node-${this.state.endNode.row}-${this.state.endNode.col}`
			).className = "node node";
		}, 20 * path.length - 20);
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.endNode.row}-${this.state.endNode.col}`
			).className = "node node-end";
		}, 20 * path.length);
	}

	async animateDijkstra() {
		await this.resetBoard(true);
		document.getElementById(
			`node-${this.state.startNode.row}-${this.state.startNode.col}`
		).className = "node node";
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.startNode.row}-${this.state.startNode.col}`
			).className = "node node-start";
		}, 20);

		const visitedInOrder = [ ...new Set(dijkstra(
			this.state.grid,
			this.state.startNode,
			this.state.endNode
		))];
		const animatingNodes = [];
		for (let i = 0; i < visitedInOrder.length; i++) {
			const node = visitedInOrder[i];
			if (
				(node.row === this.state.startNode.row &&
					node.col === this.state.startNode.col) ||
				(node.row === this.state.endNode.row &&
					node.col === this.state.endNode.col)
			) {
				continue;
			}

			if(document.getElementById(
				`node-${node.row}-${node.col}`
			).className === "node node-animating"){
				console.log('repeat');
				continue;
			}
			animatingNodes.push(
				new Promise((resolve, reject) => {
					setTimeout(() => {
						document.getElementById(
							`node-${node.row}-${node.col}`
						).className = "node node-animating";
						resolve();
					}, 20 * i);
				})
			);
		}
		await Promise.all(animatingNodes);
		document.getElementById(
			`node-${this.state.endNode.row}-${this.state.endNode.col}`
		).className = "node node";
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.endNode.row}-${this.state.endNode.col}`
			).className = "node node-end";
		}, 20);
		this.animatePath();
	}

	async animateAstar() {
		await this.resetBoard(true);
		document.getElementById(
			`node-${this.state.startNode.row}-${this.state.startNode.col}`
		).className = "node node";
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.startNode.row}-${this.state.startNode.col}`
			).className = "node node-start";
		}, 20);

		const visitedInOrder = [...new Set(astar(
			this.state.grid,
			this.state.startNode,
			this.state.endNode
		))];
		const animatingNodes = [];
		for (let i = 0; i < visitedInOrder.length; i++) {
			const node = visitedInOrder[i];
			if (
				(node.row === this.state.startNode.row &&
					node.col === this.state.startNode.col) ||
				(node.row === this.state.endNode.row &&
					node.col === this.state.endNode.col)
			) {
				continue;
			}
			animatingNodes.push(
				new Promise((resolve, reject) => {
					setTimeout(() => {
						document.getElementById(
							`node-${node.row}-${node.col}`
						).className = "node node-animating";
						resolve();
					}, 20 * i);
				})
			);
		}
		await Promise.all(animatingNodes);		

		document.getElementById(
			`node-${this.state.endNode.row}-${this.state.endNode.col}`
		).className = "node node";
		setTimeout(() => {
			document.getElementById(
				`node-${this.state.endNode.row}-${this.state.endNode.col}`
			).className = "node node-end";
		}, 20);
		
		this.animatePath();

	}

	componentDidMount() {
		const nodes = [];
		for (let i = 0; i < 20; i++) {
			const row = [];
			for (let j = 0; j < 50; j++) {
				const node = new Node(i, j);
				row.push(node);
			}
			nodes.push(row);
		}
		nodes[10][10].start = true;
		nodes[10][40].end = true;

		this.setState({
			grid: nodes,
			startNode: nodes[10][10],
			endNode: nodes[10][40]
		});
	}

	handleMouseDown(row, col) {
		const newGrid = this.state.grid.slice();
		newGrid[row][col].isWall = !newGrid[row][col].isWall;
		this.setState({
			...this.state,
			grid: newGrid,
			mousePressing: true
		});
	}

	handleMouseEnter(row, col) {
		if (!this.state.mousePressing) {
			return;
		}
		const newGrid = this.state.grid.slice();
		newGrid[row][col].isWall = !newGrid[row][col].isWall;
		this.setState({
			...this.state,
			grid: newGrid
		});
	}

	handleMouseUp() {
		this.setState({
			...this.state,
			mousePressing: false
		});
	}

	async resetBoard(keepWall) {
		const newGrid = this.state.grid;
		for (let row = 0; row < newGrid.length; row++) {
			for (let col = 0; col < newGrid[0].length; col++) {
				if(keepWall){
					if(newGrid[row][col].isWall){
						continue;
					}
				}
				document.getElementById(`node-${row}-${col}`).className =
					"node node";
				newGrid[row][col] = new Node(row, col);
			}
		}
		newGrid[10][10].start = true;
		newGrid[10][40].end = true;
		this.setState({
			grid: newGrid,
			startNode: newGrid[10][10],
			endNode: newGrid[10][40]
		});
		document.getElementById(
			`node-${this.state.startNode.row}-${this.state.startNode.col}`
		).className = "node node-start";
		document.getElementById(
			`node-${this.state.endNode.row}-${this.state.endNode.col}`
		).className = "node node-end";

		return 1;
	}

	render() {
		const grid = this.state.grid;

		return (
			<>
				<div>				
					<button onClick={() => this.animateDijkstra()}>
					Dijkstra's Algorithm
					</button>
				</div>
				<div>
				<button onClick={() => this.animateAstar()}>
					A* Algorithm
					</button>
				</div>
				<div>
					<button onClick={() => this.resetBoard(false)}>Reset</button>
				</div>
				<div className="grid">
					{grid.map((row, row_index) => {
						return (
							<div key={row_index}>
								{row.map(node => {
									return (
										<NodeBox
											row={node.row}
											col={node.col}
											start={node.start}
											end={node.end}
											isWall={node.isWall}
											onMouseDown={(row, col) =>
												this.handleMouseDown(row, col)
											}
											onMouseEnter={(row, col) =>
												this.handleMouseEnter(row, col)
											}
											onMouseUp={() =>
												this.handleMouseUp()
											}
										></NodeBox>
									);
								})}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}
