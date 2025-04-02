import UsersTable from "../../components/userTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constant/constant";
import Cookies from "js-cookie";
import RecipeTable from "@/components/recipeTable";

export default function Recipes() {
  const {
    data: recipes,
    isLoading: isRecipesLoading,
    isError: isRecipesError,
    error: recipesError,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/admin/recipes`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    },
  });

  console.log("users=>", recipes?.data);
  return (
    <div className="px-10">
      {!isRecipesLoading && <RecipeTable data={recipes} />}
    </div>
  );
}
