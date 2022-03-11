import { useSession } from "../../../../hooks/session";
import { Link } from "react-router-dom";
import ApplicationList from "./ApplicationList";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";

const ApplicationListPage = () => {
  const { loading, isLoggedIn, user } = useSession();

  return (
    <div className="bg-white flex flex-col-reverse md:flex-row">
      <main className="basis-3/4 mb-8">
        <div className="mx-3 my-4 md:mx-8 md:mt-8">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {isLoggedIn && user ? (
                <ApplicationList userId={user.id} />
              ) : (
                <div className="mx-2 text-center">
                  <Link to="/auth/github" reloadDocument className="main-btn">
                    Log In to View Your Applications
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <aside className="basis-1/4">
        <div className="mx-3 md:mr-8 my-4 mb-8"></div>
      </aside>
    </div>
  );
};

export default ApplicationListPage;
