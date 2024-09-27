import Navbar from "../components/universal/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

const FaqPage = () => {

    const auth = useAuth0();
    const { loginWithRedirect } = auth;

    return (
        <div>
            <h2 className="mt-[100px] font-bold text-xl text-white">
            Vennligst <span className="cursor-pointer text-blue-200 underline" onClick={() => loginWithRedirect()}>logg inn</span>
            </h2>
        </div>
    );
};

export default FaqPage;