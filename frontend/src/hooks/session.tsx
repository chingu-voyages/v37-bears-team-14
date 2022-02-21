import { createContext, useContext, useEffect, useState } from "react";

export type SessionData = {
  loading: boolean;
  isLoggedIn: boolean;
  user: null | {
    avatarUrl: string;
    createdAt: string;
    githubId: string;
    id: string;
    isAdmin: boolean;
    updatedAt: string;
    username: string;
  };
};

const initialData: SessionData = {
  loading: true,
  isLoggedIn: false,
  user: null,
};

export const SessionContext = createContext(initialData);

export function SessionProvider(props: any) {
  const [session, setSession] = useState(initialData);

  useEffect(() => {
    if (!session.loading) {
      return;
    }

    const fetchSession = async () => {
      const getSession = async () => {
        const resp = await fetch("/api/v1/current-session");
        if (resp.status === 200) {
          return await resp.json();
        }
        if (resp.status >= 400) {
          console.error("Session fetch error", resp);
        }
        return { isLoggedIn: false, user: null };
      };

      try {
        const session = await getSession();
        console.log(session);
        setSession({
          loading: false,
          ...session,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSession().catch(console.error);
  }, [session]);

  return (
    <SessionContext.Provider value={session}>
      {props.children}
    </SessionContext.Provider>
  );
}

/**
 * Usage:
 *     function Component() {
 *         const { loading, isLoggedIn, user } = useSession();
 *         return loading || !isLoggedIn ? (
 *             <div>Not Logged In</div>
 *         ) : (<div>{user.username} logged in</div>)
 *     }
 *
 * @returns () => SessionData
 */
export function useSession() {
  return useContext(SessionContext);
}
