"use client";

import { useUserStore } from "@/store/userStore";
import React from "react";

const DashboardAdminOrders = () => {
  const { user, isAuthenticated } = useUserStore();

  console.log(user, isAuthenticated);
  return <div>DashboardAdminOrders</div>;
};

export default DashboardAdminOrders;
