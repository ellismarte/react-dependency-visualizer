import React, { useState } from "react";
import "./App.css";
import VisualGraph from "./components/graph";

const DEPS = require("./data/dependencies.json");

const getGraph = (target, dependencyGraph = { nodes: [], links: [] }) => {
  const validNodes = new Set([target]);

  const links = DEPS.links.filter((link) => {
    if (link.target === target) {
      validNodes.add(link.source);
      return true;
    } else if (link.source === target) {
      validNodes.add(link.target);
      return true;
    }

    return false;
  });

  links.forEach((l) => {
    if (!dependencyGraph.links.includes(l)) {
      dependencyGraph.links.push(l);
    }
  });

  const nodesToAdd = DEPS.nodes.filter((node) => validNodes.has(node.id));
  nodesToAdd.forEach((n) => dependencyGraph.nodes.push(n));

  return { ...dependencyGraph };
};

function App() {
  const [dependencyGraph, setDependencyGraph] = useState(
    getGraph(DEPS.nodes[0].id)
  );

  const _setDependencyGraph = (target) => {
    setDependencyGraph(getGraph(target));
  };

  const expandNode = (target) => {
    const nextGraph = getGraph(target, dependencyGraph);
    setDependencyGraph({ ...nextGraph });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <div>
          <p className="large-font">Dependencies</p>
        </div>
      </div>

      <div style={{ display: "flex", position: "relative", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "33%",
            paddingRight: "1rem",
            border: "10px solid black",
            overflowWrap: "anywhere",
            height: "100vh",
            overflow: "hidden",
            position: "absolute",
            overflowY: "scroll",
          }}
        >
          {DEPS.nodes.map((dep) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <a
                  onClick={() => _setDependencyGraph(dep.id)}
                  href={`#${dep.id}`}
                  style={{ fontFamily: "'Roboto Mono', monospace" }}
                >
                  {dep.id}
                </a>
              </div>
            );
          })}
        </div>

        <div
          className="App"
          style={{
            position: "absolute",
            left: "33%",
            width: "67vw",
            border: "5px solid red",
          }}
        >
          <div>
            <VisualGraph
              id={`graph`}
              data={dependencyGraph}
              onClickNode={(nodeId) => {
                expandNode(nodeId);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
