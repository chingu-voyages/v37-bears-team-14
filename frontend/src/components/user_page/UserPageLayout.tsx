import React, {
  useEffect,
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams } from "react-router-dom";
import { User, Tech } from "../../shared/Interfaces";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import UserNotFound from "./UserNotFound";
import { useSession } from "../../hooks/session";
import TechComponent from "./components/TechComponent";
import TechSection from "./components/TechSection";
import UserHeader from "./components/UserHeader";
import UserUpdateButton from "./components/UserUpdateButton";
import EmptyTechSection from "./components/EmptyTechSection";

export interface UserPageContext {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const UserPageLayout: FunctionComponent = () => {
  const { username } = useParams();
  // Initial state is loading.
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<null | User>(null);
  const [selectedTech, setSelectedTech] = useState<Tech | null>();
  const [search, setSearch] = useState("");

  const sessionUser = useSession().user;

  //const [techs, setTechs] = useState();

  useEffect(() => {
    const getUser = async (username: string) => {
      const resp = await fetch("/api/v1/search/" + username);
      if (resp.status === 200) {
        const user = await resp.json();
        setUser(user);
        if (user.techs && user.techs.length > 0) setSelectedTech(user.techs[0]);
        //const arr = [a]
        //if(user.techs)Object.keys(user.techs).forEach(key => arr.push({name: key, value: user.techs[key]}))
        //setTechs(arr);
      } else if (resp.status === 404) {
        setNotFound(true);
      } else {
        console.error("Failed to get user", resp);
      }

      setLoading(false);
    };
    if (!username) {
      setNotFound(true);
    } else {
      getUser(username).catch((err) => console.error(err));
    }
  }, [username]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (notFound) {
    return <UserNotFound />;
  }

  if (!user) {
    // Something went wrong!

    console.error("Missing user!", loading, notFound, username, user);
    return <UserNotFound />;
  }

  const changeTech = (tech?: Tech) => {
    setSelectedTech(tech);
  };

  const filteredTechs =
    search.length === 0
      ? user.techs
      : user.techs.filter((tech) =>
          tech.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <section className="w-full">
      <div className="container mx-auto h-screen py-16 px-8 relative">
        <div className="flex w-full rounded-lg h-full lg:overflow-hidden overflow-auto lg:flex-row flex-col shadow-2xl">
          <div className="lg:w-1/2 bg-white text-gray-800 flex flex-col">
            <div className="p-8 shadow-md relative bg-white">
              {user && <UserHeader userProps={user} />}

              <div className="mt-6 flex">
                {sessionUser && user && sessionUser.id === user.id && (
                  <UserUpdateButton />
                )}

                <div className="relative ml-auto flex-1 pl-8 sm:block hidden">
                  <input
                    placeholder="Search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded border-gray-400 h-full focus:outline-none pl-4 pr-8 text-gray-700 text-sm text-gray-500"
                  />
                  <svg
                    stroke="currentColor"
                    className="w-4 h-4 absolute right-0 top-0 mt-3 mr-2 text-gray-500"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="overflow-auto flex-grow">
              {user &&
                user.techs &&
                filteredTechs.map((item, index) => (
                  <div key={index}>
                    <TechComponent changeTech={changeTech} tech={item} />

                    <hr></hr>
                  </div>
                ))}
            </div>
          </div>
          {selectedTech ? (
            <TechSection tech={selectedTech} />
          ) : (
            <EmptyTechSection />
          )}
        </div>
      </div>
    </section>
  );
};

export default UserPageLayout;
