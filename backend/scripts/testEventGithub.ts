import { hashHmac } from "../src/controllers/hooks/hookHelpers";
import http from "http";

const request = (options: any, postData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = "";
    const req = http.request(options, (res) => {
      res.setEncoding("utf-8");
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
};

// Usage:
// From backend directory,
// run `yarn script scripts/testEventGithub.ts`
(async () => {
  const userGithubId = 8432061;
  // Specify secret that matches the hook's secret.
  const secret =
    "DslQph3DxaWqXPQJ+gE2On3XOHDGsz2cV6aYsQWAP0ss259lJfUdua3tLofvJg2ILPcKs1gxkpY4xoV9gOPpF8NaPbaqgkmNeoRpM0iwANoR/gX/3W5eIARxaQZiJ3UK+WqWBhb13JR3i1vUCQBy4FYQXk9kBzvz7BL4pqUTb8zFPYmEm8nZnorwEZrFgxnl6JXXX2ckqirkKcgmWgiqhGfg48lYnmRBUeHK1VGVraU7t/4vzodYJadMu907L6ntmST83yiZrA2/rieWRsoVSJaXj0Yie+uU6PVTXIO6AK4+eLszjbWCsCn9ZkooDpPIfhocVoJiA1BpxoS5WkPXAw==";
  const payload = {
    sender: {
      id: userGithubId,
    },
  };
  const hash = hashHmac(JSON.stringify(payload), secret);
  console.log("sha256 signature", hash);

  // Webhook URL: "http://localhost:3000/api/v1/hooks/622b96f31f64a66474630949/events/github"
  try {
    const event = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/v1/hooks/622b96f31f64a66474630949/events/github",
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-Github-Event": "test_event",
          "X-Hub-Signature-256": "sha256=" + hash,
        },
      },
      JSON.stringify(payload)
    );
    console.log("created event", JSON.parse(event));
  } catch (err) {
    console.error("Failed", err);
  }

  process.exit(0);
})();
