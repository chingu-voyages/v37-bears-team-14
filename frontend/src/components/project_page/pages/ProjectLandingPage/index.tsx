import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectShowcase from "./components/ProjectShowcase";
import CommentForm from "../../../comments/CommentForm";
import { Comment } from "../../../../shared/Interfaces";
import NewComment from "../../../comments/NewComment";
import ApplyButtonContainer from "../../components/ApplyFlow/ApplyButtonContainer";
import StarButton from "./components/StarButton";

const ProjectLandingPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { project, setProject } = useOutletContext<ProjectPageContext>();

  useEffect(() => {
    fetch(`/api/v1/projects/${project.id}/comments`).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setComments(data);
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row">
        <main className="basis-3/4">
          <ProjectShowcase project={project} setProject={setProject} />
        </main>
        <aside className="basis-1/4">
          <div className="mx-3 my-4 md:mr-8 md:my-8">
            <StarButton project={project}></StarButton>
            <ApplyButtonContainer projectId={project.id} />
          </div>
        </aside>
      </div>
      <NewComment project={project} />
      <div className="mb-2">
        {comments.map((c) => (
          <CommentForm comment={c} project={project} />
        ))}
      </div>
    </>
  );
};

export default ProjectLandingPage;
