import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Node, NodeType } from "../../shared/GraphInterfaces";
import MinusCircleSolidIcon from "../icons/MinusCircleSolidIcon";
import PlusCircleSolidIcon from "../icons/PlusCircleSolidIcon";
import { parseNid } from "./nid";

interface NodeInfoProps {
  nid?: string;
  node?: Node;
}

const NodeInfo: FC<NodeInfoProps> = ({ nid, node }) => {
  const [open, setOpen] = useState(true);

  const iconClassName = "w-5 h-5 inline mt-[-0.2rem] mr-1 text-indigo-500";

  const resourceUrl = (() => {
    if (!node) {
      return null;
    }
    const [type, id] = parseNid(node.nid);
    switch (type) {
      case NodeType.PROJECT:
        return "/projects/" + id;
      case NodeType.USER:
        return "/user/" + node.attributes.username;
      default:
        return null;
    }
  })();

  return (
    <div className="">
      <div
        className="text-sm border-2 border-indigo-500 p-1 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <MinusCircleSolidIcon className={iconClassName} />
        ) : (
          <PlusCircleSolidIcon className={iconClassName} />
        )}
        <span className="">{node ? node.type + ": " + node.name : nid}</span>

        {resourceUrl && (
          <span className="absolute right-0 mr-2">
            <Link
              className="font-semibold text-indigo-700 hover:underline"
              to={resourceUrl}
            >
              View Resource Page
            </Link>
          </span>
        )}
      </div>
      {open && (
        <div className="border-x-2 border-b-2 border-indigo-500 p-1 pb-2 overflow-x-scroll">
          {node &&
            Object.keys(node.attributes).map((n) => {
              const value = node.attributes[n];
              return (
                <div className="flex text-sm my-1" key={n}>
                  <label className="mr-1 text-gray-600">{n}:</label>
                  <div>
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default NodeInfo;
