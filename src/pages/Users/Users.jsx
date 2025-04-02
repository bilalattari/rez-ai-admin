import UsersTable from "../../components/userTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constant/constant";
import Cookies from "js-cookie";

export default function Users() {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    },
  });

  console.log("users=>", users?.data);
  return (
    <div className="px-10">
      {!isUsersLoading && <UsersTable initialData={users} />}
    </div>
  );
}
