import React, {
  useEffect,
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams } from "react-router-dom";
import { User } from "../../shared/Interfaces";
import UserPageTech from "./UserPageTech";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import UserNotFound from "./UserNotFound";

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
  //const [techs, setTechs] = useState();

  useEffect(() => {
    const getUser = async (username: string) => {
      const resp = await fetch("/api/v1/search/" + username);
      if (resp.status === 200) {
        const user = await resp.json();
        setUser(user);
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

  return (
    <section className="w-full">
      <div className="py-1 mx-2 md:py-3 md:mx-8">
        <h1 className="text-lg py-2 bold justify-center flex">
          {user.displayName && user.displayName}
        </h1>
        <h4 className=" text-sm  text-slate-600 bold justify-center flex italic">
          {user.username && user.username}
        </h4>
        <h1 className="py-4 text-lg flex justify-center">Tech Stack</h1>

        <ul>
          {user &&
            user.techs &&
            user.techs.map((item, index) => (
              <div key={index}>
                <UserPageTech
                  tech={JSON.parse(JSON.stringify(item))}
                ></UserPageTech>
                <hr></hr>
                {/*<h1>{JSON.parse(JSON.stringify(item))["description"]}</h1>*/}
              </div>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default UserPageLayout;
