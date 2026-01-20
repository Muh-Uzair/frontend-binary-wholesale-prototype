"use client";

import { useUserStore } from "@/store/userStore";
import React from "react";

const DashboardAdminSettings = () => {
  const { user, isAuthenticated } = useUserStore();

  console.log(user, isAuthenticated);
  return <div>DashboardAdminSettings</div>;
};

export default DashboardAdminSettings;
