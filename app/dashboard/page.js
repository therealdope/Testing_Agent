"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import SideHistory from "../components/SideHistory";
import MainContent from "../components/MainContent";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/sign-in");
          return;
        }

        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          localStorage.removeItem("authToken");
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("authToken");
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header user={user} handleLogout={handleLogout} />
      <div className="flex flex-1 mt-16">
        <div 
          className={`transition-all duration-300 border-r border-gray-700 ${
            isHistoryCollapsed ? 'w-16' : 'w-72 md:w-80'
          } overflow-y-auto h-[calc(100vh-4rem)]`}
        >
          {user && (
            <SideHistory 
              userId={user._id} 
              isCollapsed={isHistoryCollapsed}
              onCollapse={setIsHistoryCollapsed}
              onSelectSubmission={handleSubmissionSelect}
            />
          )}
        </div>
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <MainContent 
            selectedSubmission={selectedSubmission}
            onClearSelection={() => setSelectedSubmission(null)}
            userId={user?._id}
          />
        </div>
      </div>
    </div>
  );
}
