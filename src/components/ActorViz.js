import { useInterpret, useSelector } from "@xstate/react";
import React, { useRef } from "react";
import { ForceGraph3D } from "react-force-graph";
import "./App.css";
import { inspect } from "@xstate/inspect";

const generateTreeFromService = (state) => {
  const nodes = [];
  const links = [];
  const parentId = state._sessionid;
  nodes.push({ id: parentId });
  Object.keys(state.children).forEach((id) => {
    nodes.push({ id });
    links.push({ target: parentId, source: id });
    // links.push({ target: id, source: parentId });
  });

  return {
    nodes,
    links,
  };
};

function App() {
  const fgRef = useRef();
  // const state = useSelector(service, (state) => state);
  // const data = generateTreeFromService(state);

  return (
    <>
      <button
      // onClick={() => {
      //   [...Array(10).keys()].forEach(() => {
      //     const link =
      //       data.links[Math.floor(Math.random() * data.links.length)];
      //     fgRef.current.emitParticle(link);
      //   });
      // }}
      >
        Emit
      </button>
      {/* <ForceGraph3D
        ref={fgRef}
        graphData={data}
        linkDirectionalParticleColor={() => "red"}
        linkDirectionalParticleWidth={6}
        linkHoverPrecision={10}
        linkDirectionalParticleSpeed={0.1}
        dagMode="td"
        onLinkClick={(link) => {
          console.log(link);
          fgRef.current.emitParticle(link);
        }}
      /> */}
    </>
  );
}

export default App;
