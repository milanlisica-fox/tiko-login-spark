import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLogout() {
  const navigate = useNavigate();
  return useCallback(() => {
    toast.success("Logged out successfully");
    navigate("/");
  }, [navigate]);
}


