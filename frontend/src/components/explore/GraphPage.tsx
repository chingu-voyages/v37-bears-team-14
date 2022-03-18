import { useCallback, useEffect, useRef, useState } from "react";
import ReactForceGraph2d from "react-force-graph-2d";
import { useSearchParams } from "react-router-dom";
import { uniqBy, uniqWith } from "lodash";
import NodeInfo from "./NodeInfo";

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

const GraphPage = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState<any>({
    nodes: [],
    links: [],
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const nid = searchParams.get("nid");
  const fgRef = useRef();

  const mergeData = (data0: any, data1: any) => {
    const deduped = {
      nodes: uniqBy(
        [
          ...data0.nodes,
          ...data1.nodes.map((n: any) => ({
            group: 1,
            id: n.nid,
            ...n,
          })),
        ],
        (n) => n.nid
      ),
      links: uniqWith(
        [
          ...data0.links,
          ...data1.edges.map((e: any) => {
            return {
              source: e.nodes[0],
              target: e.nodes[1],
              value: 1,
              ...e,
            };
          }),
        ],
        (a, b) => {
          if (a.source === b.source && a.target === b.target) {
            return true;
          } else if (a.source === b.target && a.target === b.source) {
            return true;
          } else {
            return false;
          }
        }
      ),
    };
    return deduped;
  };

  useEffect(() => {
    if (!initialLoading) return;

    if (!nid) {
      const loadAnyNid = async () => {
        const resp = await fetch("/api/v1/projects?pageSize=1");
        const projects = await resp.json();
        const nid = "P_" + projects[0].id;
        setSearchParams({ nid })
      }

      loadAnyNid().catch(console.error)
      return;
    }

    const getGraph = async () => {
      const graph = await fetch("/api/v1/graph?nid=" + nid);
      if (graph.status === 200 || graph.status === 304) {
        setData(mergeData(data, await graph.json()));
        setInitialLoading(false);
      } else {
        console.error("Failed");
      }
    };
    getGraph().catch(console.error);
  }, [nid, initialLoading, data, setSearchParams]);

  const handleClick = useCallback(
    (node) => {
      if (nid === node.nid) {
        return;
      }

      const updateGraph = async () => {
        const graph = await fetch("/api/v1/graph?nid=" + node.nid);
        if (graph.status === 200 || graph.status === 304) {
          setData(mergeData(data, await graph.json()));
        } else {
          console.error("Failed");
        }
      };

      const updateAndCenter = async () => {
        await updateGraph();
        setTimeout(() => {
          (fgRef.current as any).centerAt(node.x, node.y, 1000);
        }, 1000);
      };

      setSearchParams({ nid: node.nid });
      updateAndCenter().catch(console.error);
    },
    [fgRef, nid, data, setSearchParams]
  );

  const nodeInfo = data.nodes.find((n: any) => n.nid === nid) || null;

  return (
    <>
      <div className="absolute w-full z-10">
        <div className="relative bg-white m-2">
          {(nid && nodeInfo) && <NodeInfo nid={nid} node={nodeInfo} />}
        </div>
      </div>
      {data && (
        <div className="bg-gray-500"><ReactForceGraph2d
          ref={fgRef}
          graphData={data}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            );

            ctx.fillStyle =
              node.nid === nid
                ? "rgba(255, 255, 255, 1)"
                : "rgba(255, 255, 255, 0.7)";
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
          onNodeClick={handleClick}
        />
        </div>
      )}
    </>
  );
};

export default GraphPage;
