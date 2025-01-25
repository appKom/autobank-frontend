import { checkUserResponse } from "../components/authentication/Authcallback";
import { USER_STORAGE_KEY } from "./constants";

export async function logoutUser() {
  await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
