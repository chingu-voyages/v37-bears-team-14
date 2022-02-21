import { Router } from "express";
import logger from "../logger";

interface EndpointInfo {
  method: string;
  path: string;
}

/**
 * Parses the endpoints in the given router stack.
 * Usage:
 *     const router = Router();
 *     router.get("/foo", (req, res) => res.send("hi"))
 *     const endpoints = getEndpoints(router.stack);
 *     console.log(endpoints)
 *     >> [{method: "GET", path: "/foo"}]
 * @param routes
 * @returns
 */
export function getEndpoints(routes: any[]): EndpointInfo[] {
  const table: EndpointInfo[] = [];

  for (let key in routes) {
    if (routes.hasOwnProperty(key)) {
      let val = routes[key];
      if (val.route) {
        val = val.route;
        const method = val.stack[0].method;
        table.push({
          method: method.toUpperCase(),
          path: val.path,
        });
      } else if (val.name === "router") {
        const endpoints = getEndpoints(val.handle.stack);
        endpoints.forEach((e: any) => table.push(e));
      }
    }
  }

  return table;
}

export function printApiEndpoints(baseUrl: string, router: Router) {
  const endpoints = getEndpoints(router.stack);
  logger.info("Registered API endpoints:");
  for (const endpoint of endpoints) {
    logger.info(
      `    ${rightPad(endpoint.method, 6)} ${baseUrl}${endpoint.path}`
    );
  }
}

function rightPad(s: string, width: number): string {
  while (s.length < width) {
    s += " ";
  }
  return s;
}
