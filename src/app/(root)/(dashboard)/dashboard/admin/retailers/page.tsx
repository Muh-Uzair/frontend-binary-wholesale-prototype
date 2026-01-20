"use client";

import { useUserStore } from "@/store/userStore";
import React from "react";

const DashboardAdminRetailers = () => {
  const { user, isAuthenticated } = useUserStore();

  console.log(user, isAuthenticated);
  return <div>DashboardAdminRetailers</div>;
};

export default DashboardAdminRetailers;
