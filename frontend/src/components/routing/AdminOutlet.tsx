import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/session";

export interface AdminOutletProps {
  /// The path to redirect to when the user is not logged in. Defaults to "/".
  failureRedirect?: string;
}

/**
 * The `path=""` parameter is required for top-level nested routes!
 *
 * Usage:
 * <Routes>
 *   <Route path="/admin" element={<AdminOutlet failureRedirect="/login" />}>
 *     <Route path="" element={<AdminPage />} />
 *   </Route>
 * </Routes>
 *
 * Reference: https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
 */
export default function AdminOutlet(props: AdminOutletProps) {
  const { loading, isLoggedIn, user } = useSession();
  console.log(loading, isLoggedIn, user);
  if (loading) {
    return <></>;
  } else if (isLoggedIn && user && user.isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to={props.failureRedirect || "/"} />;
  }
}
