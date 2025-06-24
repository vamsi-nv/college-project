import { useEffect, useState } from "react";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

function RightSidebar() {
  const [clubs, setClubs] = useState([]);

  const fetchAllclubs = async () => {
    const response = await axiosInstance.get(api_paths.clubs.get_all_clubs);
    const data = response.data;

    if (data.success) {
      setClubs(data.clubs);
    }
  };

  useEffect(() => {
    fetchAllclubs();
  },[]);

  return (
    <div className="mt-10 p-6">
      <h3>What to join</h3>
      <div className="">{
        
        clubs.map((club) => <h1>{club.name}</h1>)

      }</div>
    </div>
  );
}

export default RightSidebar;
