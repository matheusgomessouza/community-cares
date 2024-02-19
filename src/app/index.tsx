import { useContext } from "react";
import SignInPage from "./signin";
import AuthenticationContext from "contexts/authentication";
import MapScreen from "./map";

export default function App() {
  const {isUserAuthenticated} = useContext(AuthenticationContext);

  return isUserAuthenticated ? <MapScreen/> : <SignInPage />;
}
