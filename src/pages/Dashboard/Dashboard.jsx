import { DashboardCards } from "@/components/DashboardCards";
import { API_BASE_URL } from "@/constant/constant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";

const Dashboard = () => {
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    },
  });

  console.log("dashboard=>", dashboard?.data);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="mx-7 mb-5">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your application statistics and performance.
        </p>
      </div>

    {!isDashboardLoading &&  <DashboardCards stats={dashboard?.data} />}  
    </div>
  );
};

export default Dashboard;
