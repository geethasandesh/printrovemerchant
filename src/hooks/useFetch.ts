import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import { toast } from "react-hot-toast";

export const useFetch = (endpoint: string, refreshDep: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<unknown | null | any>(null);
  const [cookies] = useCookies(["token"]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFetch = async () => {
    if (import.meta.env.DEV) {
      console.log('useFetch called for endpoint:', endpoint, 'refreshDep:', refreshDep);
    }
    setIsLoading(true);
    setData(null);

      try {
        const API_URL = import.meta.env.VITE_APP_API_URL;
        if (import.meta.env.DEV) {
          console.log("🔧 Environment check:", {
            VITE_APP_API_URL: API_URL,
            allEnvVars: import.meta.env
          });
        }
        
        if (!API_URL) {
          console.error("❌ VITE_APP_API_URL is not defined!");
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
        if (import.meta.env.DEV) {
          console.log('Making API request to:', url);
        }

        const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (res.status === 200) {
        if (import.meta.env.DEV) {
          console.log('✅ API Response received:', res.data);
        }
        setData(res.data);
      } else {
        if (import.meta.env.DEV) {
          console.error('❌ API Response error:', res.status, res.statusText);
        }
        throw new Error("Failed to fetch data.");
      }
      } catch (err: unknown) {
        if (import.meta.env.DEV) {
          console.error("❌ Error fetching data:", err);
          console.error("❌ Error details:", {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
            isAxiosError: axios.isAxiosError(err),
            response: axios.isAxiosError(err) ? err.response : undefined,
            request: axios.isAxiosError(err) ? err.request : undefined
          });
        }

      // Silence UI toasts for fetch errors; keep console diagnostics only
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status >= 400) {
          if (import.meta.env.DEV) {
            console.error("🚨 API Error Response:", {
              status: err.response.status,
              statusText: err.response.statusText,
              data: err.response.data,
              url: err.config?.url
            });
          }
        } else {
          if (import.meta.env.DEV) {
            console.warn("🌐 Network error (silenced):", err.message, { code: err.code, url: err.config?.url });
          }
        }
      } else if (err instanceof Error) {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Request error (silenced):", err.message);
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Unknown error occurred (silenced):", err);
        }
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
