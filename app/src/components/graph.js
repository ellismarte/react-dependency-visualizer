import React from "react";
import { Graph } from "react-d3-graph";

// graph payload (with minimalist structure)
const placeholderData = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  width: 1000,
  height: 1000,
  automaticRearrangeAfterDropNode: true,
  collapsible: true,
  directed: true,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  highlightDegree: 2,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 12,
  minZoom: 0.05,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: false,
  d3: {
    alphaTarget: 0.05,
    gravity: -250,
    linkLength: 120,
    linkStrength: 2,
    disableLinkForce: false,
  },
  node: {
    color: "lightgreen",
    size: 400,
    highlightStrokeColor: "blue",
  },
  link: {
    color: "lightgray",
    fontColor: "black",
    fontSize: 8,
    fontWeight: "normal",
    highlightColor: "red",
    highlightFontSize: 8,
    highlightFontWeight: "normal",
    labelProperty: "label",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: false,
    semanticStrokeWidth: true,
    strokeWidth: 3,
    markerHeight: 6,
    markerWidth: 15,
  },
};

// graph event callbacks
const onClickGraph = function () {
  window.alert(`Clicked the graph background`);
};

const onDoubleClickNode = function (nodeId) {
  window.alert(`Double clicked node ${nodeId}`);
};

const onRightClickNode = function (event, nodeId) {
  window.alert(`Right clicked node ${nodeId}`);
};

const onMouseOverNode = function (nodeId) {
  window.alert(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function (nodeId) {
  window.alert(`Mouse out node ${nodeId}`);
};

const onClickLink = function (source, target) {
  window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = function (event, source, target) {
  window.alert(`Right clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function (source, target) {
  window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function (source, target) {
  window.alert(`Mouse out link between ${source} and ${target}`);
};

const onNodePositionChange = function (nodeId, x, y) {
  window.alert(
    `Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`
  );
};

function VisualGraph(props) {
  const { data, id, onClickNode } = props;
  return (
    <Graph
      style={{ width: "100%", height: "100%" }}
      id={id} // id is mandatory, if no id is defined rd3g will throw an error
      data={data || placeholderData}
      config={myConfig}
      onClickNode={onClickNode}
      // onDoubleClickNode={onDoubleClickNode}
      // onRightClickNode={onRightClickNode}
      // onClickGraph={onClickGraph}
      // onClickLink={onClickLink}
      // onRightClickLink={onRightClickLink}
      // onMouseOverNode={onMouseOverNode}
      // onMouseOutNode={onMouseOutNode}
      // onMouseOverLink={onMouseOverLink}
      // onMouseOutLink={onMouseOutLink}
      // onNodePositionChange={onNodePositionChange}
    />
  );
}

export default VisualGraph;
