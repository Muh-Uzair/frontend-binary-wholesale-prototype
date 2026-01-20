"use client";

import { useUserStore } from "@/store/userStore";
import React from "react";

const DashboardAdminProducts = () => {
  const { user, isAuthenticated } = useUserStore();

  console.log(user, isAuthenticated);
  return <div>DashboardAdminProducts</div>;
};

export default DashboardAdminProducts;
