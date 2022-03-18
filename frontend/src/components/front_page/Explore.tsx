import { useEffect, useRef, useState } from "react";
import ReactForceGraph2d from "react-force-graph-2d";
import { Link } from "react-router-dom";

const getColor = (nid: string) => {
  const t = (nid || "").split("_")[0] || "";
  switch (t) {
    case "P":
      return "#4338ca";
    case "T":
      return "#d97706";
    case "U":
      return "#059669";
    default:
      return "#64748b";
  }
};

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    nodes: [],
    links: [],
  });
  const [nid, setNid] = useState("");

  const graphRef = useRef();

  useEffect(() => {
    if (!loading) return;

    const loadExplore = async () => {
      const resp = await fetch("/api/v1/projects?pageSize=1");
      const projects = await resp.json();

      const nid = "P_" + projects[0].id;
      setNid(nid);
      const respP = await fetch("/api/v1/graph?nid=" + nid);
      const { nodes, edges } = await respP.json();

      setData({
        nodes: nodes.map((n: any) => ({
          group: 1,
          id: n.nid,
          ...n,
        })),
        links: edges.map((e: any) => {
          return {
            source: e.nodes[0],
            target: e.nodes[1],
            value: 1,
            ...e,
          };
        }),
      });
      setLoading(false);
      setTimeout(() => {
        (graphRef.current as any).zoomToFit(1000);
      }, 1000);
    };

    loadExplore().catch(console.error);
  }, [loading]);

  return (
    <div className="h-[300px] overflow-hidden bg-gray-700">
      <div className="absolute z-10 w-full text-center md:text-right">
        <div className="mx-3 md:mx-8">
          <div className="mt-16 md:mt-20 mb-6 text-4xl text-white">
            Explore the relationships interactively.
          </div>
          <Link
            className="main-btn px-20 mr-0"
            to={!!nid ? "/explore?nid=" + nid : ""}
          >
            Explore
          </Link>
        </div>
      </div>
      <ReactForceGraph2d
        height={300}
        ref={graphRef}
        enablePointerInteraction={false}
        enablePanInteraction={false}
        enableZoomInteraction={false}
        graphData={data}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          );

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            // @ts-ignore
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = getColor(node.nid);
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
      />
    </div>
  );
};

export default Explore;
