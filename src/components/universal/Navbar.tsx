import React, { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

import { useAuth0 } from "@auth0/auth0-react";
import LogOutIcon from "../../icons/LogOutIcon";
import Button from "./Button";
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

type User = {
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
};

type NavdropdownProps = {
  user?: User;
  logout: () => void;
  login: () => void;
  isAuthenticated: boolean;
};

const routes = [
  { name: "Kvittering", path: "/kvittering" },
  { name: "Søknad", path: "/soknad" },
  { name: "Min side", path: "/minside" },
];

const NavDropdown = (props: NavdropdownProps) => {
  return (
    <div className="lg:hidden absolute top-12 right-0 z-10 w-48 py-2 mt-2 text-[18px] text-white border border-none rounded-lg shadow-xl cursor-pointer bg-[#2e6e53]">
      {props.isAuthenticated ? (
        <div>
          <div className="">
            <button className="hover:bg-green-900 flex items-center w-full rounded-[10px] justify-center relativ p-4  h-[50px] bg-[#2e6e53] justify-self-end relative z-20 ">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }resources/logo/online-logo-white.png`}
                className="h-5 mr-2"
              ></img>
              <p>{props.user?.given_name}</p>
            </button>
          </div>

          <div className="flex hover:bg-green-900 items-center w-full rounded-lg justify-center relativ p-4  h-[50px] bg-[#2e6e53] justify-self-end relative z-20">
            <button
              onClick={() => props.logout()}
              className="flex items-center w-full justify-center relativ p-4  h-[50px] justify-self-end relative z-20"
            >
              <p>Logg ut</p>
              <LogOutIcon className="w-4 h-4 m-3" />
            </button>
          </div>
          <hr className="border-b-2 w-full "></hr>

          {routes.map((route) => (
            <div className="text-white text-[20px] p-3 rounded-[10px] hover:bg-green-800 cursor-pointer">
              {route.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex hover:bg-gray-200 items-center w-full justify-center relativ p-4  h-[50px] bg-white justify-self-end relative z-20">
          <button
            onClick={() => props.login()}
            className="flex items-center w-full justify-center relativ p-4  h-[50px] justify-self-end relative z-20"
          >
            <img
              src="resources/logo/online-logo-blue.png"
              className="h-5 mr-2"
            ></img>
            <p>Logg inn</p>
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [showNavDropdown, setShowNavDropdown] = useState<Boolean>(false);

  const toggleNavbarDropdown = () => {
    setShowNavDropdown(!showNavDropdown);
  };

  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();


  return (
    <div className="bg-[#2e6e53] flex">
      <div className="flex items-center justify-between p-3 w-full">
        <div className="flex items-center">
          <img
            src={`${
              import.meta.env.BASE_URL
            }resources/logo/online-logo-white.png`}
            className="h-12 w-auto cursor-pointer hidden dark:block"
          ></img>
          <p className="text-[25px] ml-3 font-semibold text-white">Autobank</p>
        </div>

        {/* Navbar small-medium width */}
        <button
          onClick={toggleNavbarDropdown}
          className="flex justify-end abolute right-0 lg:hidden"
        >
          <Bars3Icon
            className={`cursor-pointer text-white h-9 relative justify-self-end absolute top-0 right-0 transition-transform transform ${
              showNavDropdown ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <XMarkIcon
            className={`cursor-pointer text-white h-9 relative justify-self-end absolute top-0 right-0 transition-transform transform ${
              showNavDropdown
                ? "rotate-0 opacity-100"
                : "rotate-45 opacity-0 hidden"
            }`}
          />
        </button>
        {showNavDropdown && (
          <NavDropdown
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
            login={loginWithRedirect}
          />
        )}

        {/* Navbar large width */}
        {isAuthenticated ? (
          <div className="hidden lg:flex flex justify-self-end absolute right-[20px] gap-10 items-center">
            <div className='flex justify-self-end md:static right-[20px] gap-10 items-center'>
              <div className={(showNavDropdown ? "" : "hidden") + " border-[1px] border-green-800 flex rounded-[10px] flex-col absolute top-[50px] left-[-70px] bg-[#2e6e53] md:border-0 md:flex-row md:flex md:column md:static md:bg-inherit"}>

                <a className="text-white text-[20px] p-3  md:ml-4 rounded-[10px] hover:bg-green-800 cursor-pointer" href="/kvittering">Kvittering</a>
                <a className="text-white  text-[20px] p-3 md:ml-4 rounded-[10px] hover:bg-green-800 cursor-pointer" href="/soknad">Søknad</a>
                <a className="text-white  text-[20px] p-3 md:ml-4 rounded-[10px] hover:bg-green-800  cursor-pointer" href="/minside">Min side</a>
              </div>
            </div>
            <div>
              <Button
                title="Logg ut"
                color="white"
                size="small"
                icon={<LogOutIcon className="w-4 h-4" />}
                onClick={() => logout()}
              />
            </div>
            <div>
              <button className="flex rounded-[15px] items-center justify-center relativ p-4  h-[50px] bg-white justify-self-end relative z-20">
                <img
                  src={`${
                    import.meta.env.BASE_URL
                  }resources/logo/online-logo-blue.png`}
                  className="h-5 mr-2"
                ></img>
                <p>{user?.name}</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden  lg:flex justify-self-end absolute right-[20px] gap-10 items-center">
            <button
              onClick={() => loginWithRedirect()}
              className="flex rounded-[15px] items-center justify-center relativ p-4  h-[50px] bg-white justify-self-end relative z-20"
            >
              <img
                src="resources/logo/online-logo-blue.png"
                className="h-5 mr-2"
              ></img>
              <a>Logg inn</a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
