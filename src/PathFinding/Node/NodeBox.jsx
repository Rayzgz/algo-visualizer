import React, { Component } from "react";

import "./NodeBox.css";

export class NodeBox extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			row,
			col,
			start,
			end,
			isWall,
			onMouseDown,
			onMouseEnter,
			onMouseUp
		} = this.props;
		let node_class = "node";
		if (start) {
			node_class += "-start";
		} else if (end) {
			node_class += "-end";
		} else if (isWall) {
			node_class += "-wall";
		}
		return (
			<div
				id={`node-${row}-${col}`}
				className={`node ${node_class}`}
				onMouseDown={() => onMouseDown(row, col)}
				onMouseEnter={() => onMouseEnter(row, col)}
				onMouseUp={() => onMouseUp()}
			></div>
		);
	}
}
