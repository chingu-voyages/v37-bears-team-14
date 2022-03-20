import React from "react";
import { render } from "@testing-library/react";
import ProjectEventPreview from "./index";
import { StaticRouter } from "react-router-dom/server";

import event from "./test_data/repo_push.0.json";
import moment from "moment";

test("renders repo_push", () => {
  const now = moment(event.createdAt).add(1, "hours").toDate();

  const { container } = render(
    <StaticRouter location="/">
      <ProjectEventPreview event={event as any} now={now} />
    </StaticRouter>
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <div>
        <a
          class="text-emerald-600 hover:underline"
          href="/user/mtso"
        >
          mtso
        </a>
         pushed to
         
        <a
          class="text-emerald-600 hover:underline"
          href="https://github.com/chingu-voyages/v37-bears-team-14/tree/main"
        >
          refs/heads/main
        </a>
      </div>
      <div
        class="text-sm text-gray-500"
        title="2022-03-19T23:26:26+00:00"
      >
        an hour ago
      </div>
    </div>
  `);
});
