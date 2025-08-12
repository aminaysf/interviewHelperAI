"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { verifyUserAccessApiCall } from "@/controllers/Auth";
import { SiteHeader } from "@/components/routes/header";
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
    try {
      const res = await verifyUserAccessApiCall();
      setAuthenticated(true);
      setUserDetails(res.data.user);
      console.log("Verification success:", res.data);
      router.replace("/dashboard");
    } catch (err: any) {
      setAuthenticated(false);
      const errorMessage = err.message || err.message || "Verification failed";
      console.error("Verification error:", errorMessage, err);
      setError(errorMessage);
      if (err.status === 401 || err.status === 403) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-svh flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-svh flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <p className="text-red-500 text-center">{error}</p>
          <Home />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Home />
      </main>
    </div>
  );
}