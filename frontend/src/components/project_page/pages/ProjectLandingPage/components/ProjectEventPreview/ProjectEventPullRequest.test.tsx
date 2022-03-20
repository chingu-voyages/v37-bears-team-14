import React from "react";
import { render } from "@testing-library/react";
import ProjectEventPreview from "./index";
import { StaticRouter } from "react-router-dom/server";

import event from "./test_data/repo_pull_request.0.json";
import moment from "moment";

test("renders repo_pull_request", () => {
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
          href="/user/seann1"
        >
          seann1
        </a>
         
        opened
         
        <a
          class="text-emerald-600 hover:underline"
          href="https://github.com/chingu-voyages/v37-bears-team-14/pull/109"
        >
          Pull Request #
          109
        </a>
      </div>
      <div
        class="font-semibold_ text-sm text-gray-500"
        title="2022-03-19T17:04:19-07:00"
      >
        an hour ago
      </div>
    </div>
  `);
});
