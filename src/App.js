import { createWindowReceiver } from "@xstate/inspect";
import { useInterpret, useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./App.css";
import ActorVizMachine from "./machines/ActorVizMachine";

const selectLinks = (state) => state.context.links;
const selectNodes = (state) => state.context.nodes;

function App() {
  const service = useInterpret(ActorVizMachine, { devTools: true });
  const links = useSelector(service, selectLinks);
  const nodes = useSelector(service, selectNodes);
  const data = { links, nodes };
  const fgRef = useRef();

  useEffect(() => {
    const windowReceiver = createWindowReceiver(/* options? */);

    windowReceiver.subscribe((event) => {
      // here, you will receive "service.*" events
      console.log("subscribe", event);
      service.send(event);
    });

    service.send({ type: "SET_GRAPH_REF", graphRef: fgRef });
  }, [service]);

  return (
    <div className="App">
      <ForceGraph2D
        linkOpacity={1}
        linkWidth={3}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id + " (" + node.name + ")";
          const fontSize = (12 / globalScale) * 3;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
        }}
        ref={fgRef}
        graphData={data}
        linkDirectionalParticleColor={() => "red"}
        linkDirectionalParticleWidth={10}
        linkHoverPrecision={10}
        linkDirectionalParticleSpeed={0.02}
        onLinkClick={(link) => {
          fgRef.current.emitParticle(link);
        }}
      />
    </div>
  );
}

export default App;
