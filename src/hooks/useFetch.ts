import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";

export const useFetch = (endpoint: string, refreshDep: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<unknown | null | any>(null);
  const [cookies] = useCookies(["token"]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFetch = async () => {
    console.log('useFetch called for endpoint:', endpoint, 'refreshDep:', refreshDep);
    setIsLoading(true);
    setData(null);

      try {
        const API_URL = import.meta.env.VITE_APP_API_URL;
        if (!API_URL) {
          throw new Error("API URL is not defined. Please check your environment variables.");
        }

        // Normalize base and endpoint to avoid double /api or missing slashes
        const base = API_URL.replace(/\/+$/, ""); // trim trailing slashes
        let ep = endpoint || "";
        if (!ep.startsWith("/")) ep = `/${ep}`;
        // If base already ends with /api and endpoint starts with /api, drop one /api
        const baseEndsWithApi = /\/api$/i.test(base);
        if (baseEndsWithApi && /^\/api(\/|$)/i.test(ep)) {
          ep = ep.replace(/^\/api/i, "");
          if (!ep.startsWith("/")) ep = `/${ep}`;
        }
        const url = `${base}${ep}`;
        console.log('Making API request to:', url);

        const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (res.status === 200) {
        setData(res.data);
      } else {
        throw new Error("Failed to fetch data.");
      }
      } catch (err: unknown) {
        console.error("Error fetching data:", err);

      if (axios.isAxiosError(err)) {
        // Only show toast for client errors (4xx) and server errors (5xx), not for network issues
        if (err.response && err.response.status >= 400) {
          const errorMessage = err.response?.data?.message || `${err.response?.status || ''} ${err.response?.statusText || ''}` || "Something went wrong!";
          toast.error(errorMessage);
        } else {
          // For network errors, just log them without showing toast
          console.warn("Network error (this might be expected):", err.message);
        }
      } else if (err instanceof Error) {
        console.warn("Request error:", err.message);
      } else {
        console.warn("Unknown error occurred:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [endpoint, cookies.token, refreshDep, refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { data, isLoading, refetch };
};
