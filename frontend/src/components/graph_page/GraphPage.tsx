import { useCallback, useEffect, useRef, useState } from "react";
import ReactForceGraph2d from "react-force-graph-2d";
import { useSearchParams } from "react-router-dom";
import { uniqBy, uniqWith } from "lodash";

const GraphPage = () => {
  const [data, setData] = useState<any>({
    nodes: [],
    links: [],
  });
  const [searchParams] = useSearchParams();
  const nid = searchParams.get("nid");

  useEffect(() => {
    if (!nid) return;
    const getGraph = async () => {
      const graph = await fetch("/api/v1/graph?nid=" + nid);
      if (graph.status === 200 || graph.status === 304) {
        const data = await graph.json();
        setData({
          nodes: data.nodes.map((n: any) => ({
            group: 1,
            id: n.nid,
            ...n,
          })),
          links: data.edges.map((e: any) => {
            return {
              source: e.nodes[0],
              target: e.nodes[1],
              value: 1,
            };
          }),
        });
      } else {
        console.error("Failed");
      }
    };
    getGraph().catch(console.error);
  }, [nid]);

  const load = (nid: string, data: any) => {
    const getGraph = async () => {
      const graph = await fetch("/api/v1/graph?nid=" + nid);
      if (graph.status === 200 || graph.status === 304) {
        const _data = await graph.json();
        const deduped = {
          nodes: uniqBy(
            [
              ...data.nodes,
              ..._data.nodes.map((n: any) => ({
                group: 1,
                id: n.nid,
                ...n,
              })),
            ],
            (n) => n.nid
          ),
          links: [
            ...data.links,
            ..._data.edges.map((e: any) => {
              return {
                source: e.nodes[0],
                target: e.nodes[1],
                value: 1,
                ...e,
              };
            }),
          ],
          // links: uniqWith(
          //   [
          //     ...data.links,
          //     ..._data.edges.map((e: any) => {
          //       return {
          //         source: e.nodes[0],
          //         target: e.nodes[1],
          //         value: 1,
          //         ...e,
          //       };
          //     }),
          //   ],
          //   (a, b) => {
          //     return false;
          //     // return a.nodes[0] === b.nodes[0] && a.nodes[1] === b.nodes[1]
          //   }
          // ),
        }
        console.log(deduped)
        setData(deduped);
      } else {
        console.error("Failed");
      }
    };
    getGraph().catch(console.error);
  };

  const fgRef = useRef();
  const handleClick = useCallback(
    (node) => {
      // console.log("click", node)
      // // Aim at node from outside it
      // const distance = 40;
      // const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

      (fgRef.current as any).centerAt(node.x, node.y, 3000);
      // (fgRef.current as any).cameraPosition(
      //   { x: node.x, y: node.y },
      //   // { x: node.x * distRatio, y: node.y * distRatio }, // new position
      //   node, // lookAt ({ x, y, z })
      //   3000  // ms transition duration
      // );
      console.log("loading", node.nid);
      load(node.nid, data);
    },
    [fgRef, data]
  );
  return (
    <>
      {data && (
        <ReactForceGraph2d
          ref={fgRef}
          graphData={data}
          nodeAutoColorBy="auto"
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            ); // some padding

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            // @ts-ignore
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
            // @ts-ignore
            ...bckgDimensions
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
          }}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            // @ts-ignore
            bckgDimensions &&
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] / 2,
            // @ts-ignore
            ...bckgDimensions
              );
          }}
          onNodeClick={handleClick}
        />
      )}
    </>
  );
};

export default GraphPage;
