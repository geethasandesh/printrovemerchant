import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";

export const usePatch = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const handlePatch = async (
    endpoint: string,
    id: string,
    body: unknown,
    redirect_url?: string,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_APP_API_URL;
      if (!API_URL) {
        throw new Error("API URL is not defined. Please check your environment variables.");
      }

      const res = await axios.patch(`${API_URL}${endpoint}/${id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (res.status === 200 || res.status === 204) {
        // toast.success("Successfully updated! 🎉");

        if (onSuccess) {
          onSuccess();
        }

        if (redirect_url) {
          navigate(redirect_url);
        }
      }
    } catch (error: unknown) {
      console.error("Error updating data:", error);

      // Silence UI error toasts for PATCH
    } finally {
      setIsLoading(false);
    }
  };

  return { handlePatch, isLoading };
};
