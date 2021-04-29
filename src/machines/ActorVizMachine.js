import { createMachine, assign, sendParent } from "xstate";

const ActorVizMachine = createMachine(
  {
    id: "todo",
    initial: "reading",
    context: {
      links: [],
      nodes: [],
      graphRef: undefined,
    },
    on: {
      SET_GRAPH_REF: {
        actions: ["assignGraphRef"],
      },
      "service.register": [
        {
          actions: ["addNode", "addLink"],
          cond: (ctx, event) => event.parent,
        },
        {
          actions: ["addNode"],
        },
      ],
      "service.event": [
        {
          actions: ["emitParticle", (ctx, event) => console.log(event)],
          cond: (ctx, event) => event.event.origin,
        },
        {
          // actions: ["addNode"],
        },
      ],
    },
    states: {
      reading: {},
    },
  },
  {
    actions: {
      assignGraphRef: assign({
        graphRef: (ctx, event) => event.graphRef,
      }),
      addNode: assign({
        nodes: (ctx, event) => [
          ...ctx.nodes,
          { id: event.sessionId, name: event.machine.id },
        ],
      }),
      addLink: assign({
        links: (ctx, event) => [
          ...ctx.links,
          { target: event.parent, source: event.sessionId },
        ],
      }),
      emitParticle: (ctx, event) => {
        const link = ctx.links.find(
          (link) =>
            link.source.id === event.event.origin &&
            link.target.id === event.sessionId
        );
        if (link) {
          ctx.graphRef.current.emitParticle(link);
        }
      },
    },
  }
);

export default ActorVizMachine;
