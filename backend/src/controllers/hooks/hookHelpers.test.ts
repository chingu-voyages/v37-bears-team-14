import { verifySignature } from "./hookHelpers";

test("verifySignature against GitHub payload", () => {
  const payload = {
    action: "edited",
    changes: {
      body: {
        from: '<img width="788" alt="Screen Shot 2022-03-10 at 9 49 23 PM" src="https://user-images.githubusercontent.com/8432061/157810060-1ab44668-552c-4db2-a3e7-52ef1a9a9ba8.png">\r\n<img width="788" alt="Screen Shot 2022-03-10 at 9 49 17 PM" src="https://user-images.githubusercontent.com/8432061/157810063-6c10403b-816a-4fa4-8c39-9484a963a13e.png">\r\n<img width="1038" alt="Screen Shot 2022-03-10 at 9 48 57 PM" src="https://user-images.githubusercontent.com/8432061/157810065-58225392-4a03-4c6d-babc-de4de75f5c90.png">\r\n',
      },
    },
    issue: {
      url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75",
      repository_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14",
      labels_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75/labels{/name}",
      comments_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75/comments",
      events_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75/events",
      html_url: "https://github.com/chingu-voyages/v37-bears-team-14/pull/75",
      id: 1166023192,
      node_id: "PR_kwDOGy4p6s40R22v",
      number: 75,
      title: "Implement /applications page",
      user: {
        login: "mtso",
        id: 8432061,
        node_id: "MDQ6VXNlcjg0MzIwNjE=",
        avatar_url: "https://avatars.githubusercontent.com/u/8432061?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/mtso",
        html_url: "https://github.com/mtso",
        followers_url: "https://api.github.com/users/mtso/followers",
        following_url:
          "https://api.github.com/users/mtso/following{/other_user}",
        gists_url: "https://api.github.com/users/mtso/gists{/gist_id}",
        starred_url: "https://api.github.com/users/mtso/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/mtso/subscriptions",
        organizations_url: "https://api.github.com/users/mtso/orgs",
        repos_url: "https://api.github.com/users/mtso/repos",
        events_url: "https://api.github.com/users/mtso/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/mtso/received_events",
        type: "User",
        site_admin: false,
      },
      labels: [],
      state: "open",
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: "2022-03-11T05:36:53Z",
      updated_at: "2022-03-11T07:05:46Z",
      closed_at: null,
      author_association: "CONTRIBUTOR",
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/pulls/75",
        html_url: "https://github.com/chingu-voyages/v37-bears-team-14/pull/75",
        diff_url:
          "https://github.com/chingu-voyages/v37-bears-team-14/pull/75.diff",
        patch_url:
          "https://github.com/chingu-voyages/v37-bears-team-14/pull/75.patch",
        merged_at: null,
      },
      body: "# Changes\r\n\r\n- Implements `/applications` page to show list of user's Applications\r\n- Implements `/applications/{id}` page to show an application and allow edits\r\n\r\n# Testing\r\n\r\n- Run app\r\n- Go to `/applications`\r\n- Test that search filters work\r\n- Test that single app page allows requestedRole and message changes\r\n\r\nCloses #59 ",
      reactions: {
        url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75/timeline",
      performed_via_github_app: null,
    },
    comment: {
      url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/comments/1064795116",
      html_url:
        "https://github.com/chingu-voyages/v37-bears-team-14/pull/75#issuecomment-1064795116",
      issue_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/75",
      id: 1064795116,
      node_id: "IC_kwDOGy4p6s4_d3vs",
      user: {
        login: "mtso",
        id: 8432061,
        node_id: "MDQ6VXNlcjg0MzIwNjE=",
        avatar_url: "https://avatars.githubusercontent.com/u/8432061?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/mtso",
        html_url: "https://github.com/mtso",
        followers_url: "https://api.github.com/users/mtso/followers",
        following_url:
          "https://api.github.com/users/mtso/following{/other_user}",
        gists_url: "https://api.github.com/users/mtso/gists{/gist_id}",
        starred_url: "https://api.github.com/users/mtso/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/mtso/subscriptions",
        organizations_url: "https://api.github.com/users/mtso/orgs",
        repos_url: "https://api.github.com/users/mtso/repos",
        events_url: "https://api.github.com/users/mtso/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/mtso/received_events",
        type: "User",
        site_admin: false,
      },
      created_at: "2022-03-11T05:49:42Z",
      updated_at: "2022-03-11T07:05:46Z",
      author_association: "CONTRIBUTOR",
      body: '<img width="1038" alt="Screen Shot 2022-03-10 at 9 48 57 PM" src="https://user-images.githubusercontent.com/8432061/157810065-58225392-4a03-4c6d-babc-de4de75f5c90.png">\r\n<img width="788" alt="Screen Shot 2022-03-10 at 9 49 17 PM" src="https://user-images.githubusercontent.com/8432061/157810063-6c10403b-816a-4fa4-8c39-9484a963a13e.png">\r\n<img width="788" alt="Screen Shot 2022-03-10 at 9 49 23 PM" src="https://user-images.githubusercontent.com/8432061/157810060-1ab44668-552c-4db2-a3e7-52ef1a9a9ba8.png">\r\n',
      reactions: {
        url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/comments/1064795116/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      performed_via_github_app: null,
    },
    repository: {
      id: 456010218,
      node_id: "R_kgDOGy4p6g",
      name: "v37-bears-team-14",
      full_name: "chingu-voyages/v37-bears-team-14",
      private: false,
      owner: {
        login: "chingu-voyages",
        id: 45506501,
        node_id: "MDEyOk9yZ2FuaXphdGlvbjQ1NTA2NTAx",
        avatar_url: "https://avatars.githubusercontent.com/u/45506501?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/chingu-voyages",
        html_url: "https://github.com/chingu-voyages",
        followers_url: "https://api.github.com/users/chingu-voyages/followers",
        following_url:
          "https://api.github.com/users/chingu-voyages/following{/other_user}",
        gists_url:
          "https://api.github.com/users/chingu-voyages/gists{/gist_id}",
        starred_url:
          "https://api.github.com/users/chingu-voyages/starred{/owner}{/repo}",
        subscriptions_url:
          "https://api.github.com/users/chingu-voyages/subscriptions",
        organizations_url: "https://api.github.com/users/chingu-voyages/orgs",
        repos_url: "https://api.github.com/users/chingu-voyages/repos",
        events_url:
          "https://api.github.com/users/chingu-voyages/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/chingu-voyages/received_events",
        type: "Organization",
        site_admin: false,
      },
      html_url: "https://github.com/chingu-voyages/v37-bears-team-14",
      description:
        "LinkUp - Matching devs with projects on tech stack. | Voyage-37 | https://chingu.io/ | Twitter: https://twitter.com/ChinguCollabs",
      fork: false,
      url: "https://api.github.com/repos/chingu-voyages/v37-bears-team-14",
      forks_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/forks",
      keys_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/keys{/key_id}",
      collaborators_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/collaborators{/collaborator}",
      teams_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/teams",
      hooks_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/hooks",
      issue_events_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/events{/number}",
      events_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/events",
      assignees_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/assignees{/user}",
      branches_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/branches{/branch}",
      tags_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/tags",
      blobs_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/git/blobs{/sha}",
      git_tags_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/git/tags{/sha}",
      git_refs_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/git/refs{/sha}",
      trees_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/git/trees{/sha}",
      statuses_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/statuses/{sha}",
      languages_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/languages",
      stargazers_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/stargazers",
      contributors_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/contributors",
      subscribers_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/subscribers",
      subscription_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/subscription",
      commits_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/commits{/sha}",
      git_commits_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/git/commits{/sha}",
      comments_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/comments{/number}",
      issue_comment_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues/comments{/number}",
      contents_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/contents/{+path}",
      compare_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/compare/{base}...{head}",
      merges_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/merges",
      archive_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/{archive_format}{/ref}",
      downloads_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/downloads",
      issues_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/issues{/number}",
      pulls_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/pulls{/number}",
      milestones_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/milestones{/number}",
      notifications_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/notifications{?since,all,participating}",
      labels_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/labels{/name}",
      releases_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/releases{/id}",
      deployments_url:
        "https://api.github.com/repos/chingu-voyages/v37-bears-team-14/deployments",
      created_at: "2022-02-05T23:25:33Z",
      updated_at: "2022-02-24T15:38:22Z",
      pushed_at: "2022-03-11T05:52:45Z",
      git_url: "git://github.com/chingu-voyages/v37-bears-team-14.git",
      ssh_url: "git@github.com:chingu-voyages/v37-bears-team-14.git",
      clone_url: "https://github.com/chingu-voyages/v37-bears-team-14.git",
      svn_url: "https://github.com/chingu-voyages/v37-bears-team-14",
      homepage: "https://v37-bears-team-14.fly.dev",
      size: 1535,
      stargazers_count: 3,
      watchers_count: 3,
      language: "TypeScript",
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      forks_count: 1,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 17,
      license: null,
      allow_forking: true,
      is_template: false,
      topics: [],
      visibility: "public",
      forks: 1,
      open_issues: 17,
      watchers: 3,
      default_branch: "main",
    },
    organization: {
      login: "chingu-voyages",
      id: 45506501,
      node_id: "MDEyOk9yZ2FuaXphdGlvbjQ1NTA2NTAx",
      url: "https://api.github.com/orgs/chingu-voyages",
      repos_url: "https://api.github.com/orgs/chingu-voyages/repos",
      events_url: "https://api.github.com/orgs/chingu-voyages/events",
      hooks_url: "https://api.github.com/orgs/chingu-voyages/hooks",
      issues_url: "https://api.github.com/orgs/chingu-voyages/issues",
      members_url:
        "https://api.github.com/orgs/chingu-voyages/members{/member}",
      public_members_url:
        "https://api.github.com/orgs/chingu-voyages/public_members{/member}",
      avatar_url: "https://avatars.githubusercontent.com/u/45506501?v=4",
      description: "",
    },
    sender: {
      login: "mtso",
      id: 8432061,
      node_id: "MDQ6VXNlcjg0MzIwNjE=",
      avatar_url: "https://avatars.githubusercontent.com/u/8432061?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/mtso",
      html_url: "https://github.com/mtso",
      followers_url: "https://api.github.com/users/mtso/followers",
      following_url: "https://api.github.com/users/mtso/following{/other_user}",
      gists_url: "https://api.github.com/users/mtso/gists{/gist_id}",
      starred_url: "https://api.github.com/users/mtso/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/mtso/subscriptions",
      organizations_url: "https://api.github.com/users/mtso/orgs",
      repos_url: "https://api.github.com/users/mtso/repos",
      events_url: "https://api.github.com/users/mtso/events{/privacy}",
      received_events_url: "https://api.github.com/users/mtso/received_events",
      type: "User",
      site_admin: false,
    },
  };

  const xHubSignature =
    "sha256=7a6005865572a62b533daa2e4ca7c06ceacbc73babce54cbbd88b66a077f3406";
  const verification = verifySignature(
    xHubSignature,
    JSON.stringify(payload),
    "test-secret"
  );
  expect(verification).toBe(true);
});
