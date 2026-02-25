"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContributorsRootPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the goal creation page directly 
        // since the screenshot flow is focused on creating a new group
        router.push("/contributors/create");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a53c8]"></div>
        </div>
    );
}
