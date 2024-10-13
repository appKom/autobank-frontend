export interface Committee {
  id: number;
  name: string;
}

export const fetchCommittees = async (getAccessTokenSilently: Function) => {
  const accesstoken = await getAccessTokenSilently();
  return fetch(
    (import.meta.env.VITE_BACKEND_URI as string) + "/api/committee/all",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + accesstoken,
      },
    }
  ).then((res) => res.json());
};
