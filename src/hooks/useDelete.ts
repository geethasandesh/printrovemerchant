import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
export const useDelete = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cookies] = useCookies(["token"]); // Get token from cookiesz
    const handleDelete = async (endpoint: string, onSuccess?: () => void) => {
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_APP_API_URL;
            if (!API_URL) {
                throw new Error("API URL is not defined. Please check your environment variables.");
            }
            const res = await axios.delete(`${API_URL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${cookies.token}`, // Include Bearer Token
                },
            });
            if (res.status === 200 || res.status === 204) {
                toast.success("Successfully deleted! 🎉");
                // Refresh component by calling onSuccess
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: unknown) {
            console.error("Error deleting data:", error);        
            let errorMessage = "Something went wrong!";            
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }        
            toast.error(errorMessage);
        }finally {
            setIsLoading(false);
        }
    };
    return { handleDelete, isLoading };
};