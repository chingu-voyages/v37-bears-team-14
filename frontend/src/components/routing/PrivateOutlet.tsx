import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/session";

export interface PrivateOutletProps {
  /// The path to redirect to when the user is not logged in. Defaults to "/".
  failureRedirect?: string;
}

/**
 * The `path=""` parameter is required for top-level nested routes!
 *
 * Usage:
 * <Routes>
 *   <Route path="/private" element={<PrivateOutlet failureRedirect="/login" />}>
 *     <Route path="" element={<PrivatePage />} />
 *   </Route>
 * </Routes>
 *
 * Reference: https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
 */
export default function PrivateOutlet(props: PrivateOutletProps) {
  const { loading, isLoggedIn } = useSession();
  if (loading) {
    return <></>;
  } else if (isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to={props.failureRedirect || "/"} />;
  }
}
