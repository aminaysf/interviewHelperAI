"use client";
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { verifyUserAccessApiCall } from "@/controllers/Auth";
import { SiteHeader } from "@/components/routes/header";
import { Hero } from "@/components/routes/hero";
import Dashboard from "./dashboard/page";
import Home from "./home/page";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUserDetails = useAuthStore((state) => state.setUserDetails);
  
  async function verifyUser() {
    setError("");
    setLoading(true);
    console.log("here")
    try {
      await verifyUserAccessApiCall()
        .then((res) => {
          setAuthenticated(true);
          setUserDetails(res.data.user);
          console.log("data", res.data);
          router.replace("/dashboard");
        })
        .catch((err) => {
          setAuthenticated(false);
          console.log("err", err.response?.status);
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.log("error", err.response.data.message);
            // setError("something went wrong");
            router.push("/");

          } else {
            setError(err.response?.data?.message || "something went wrong");
          }
        });
    } catch (error) {
      setAuthenticated(false);
      console.log("error", error);
      setError("something went wrong");
    }
    setLoading(false);
  }
  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div className="min-h-svh flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Home />
       
      </main>
    </div>
  )
}
