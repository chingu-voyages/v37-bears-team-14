import React, {
  useEffect,
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams } from "react-router-dom";
import { User } from "../../shared/Interfaces";
import { TechComponent } from "./components/TechComponent";
import UserHeader from "./components/UserHeader";
import UserUpdateButton from "./components/UserUpdateButton";
import UserPageUpdate from "./UserPageUpdate";
import { useSession } from "../../hooks/session";

const Test: FunctionComponent = () => {
  const { loading: loadingSession, isLoggedIn, user } = useSession();

  return (
    <div>
      <UserPageUpdate />
    </div>
  );
};

export default Test;
