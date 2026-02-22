import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

interface AuthSidebarProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function AuthSidebar({ title, description, children, className }: AuthSidebarProps) {
  return (
    <div className={cn("hidden lg:flex w-1/2 bg-gradient-to-b from-[#141936] to-[#4556c0] fixed left-0 top-0 h-screen flex-col justify-center items-center text-white p-12 overflow-hidden", className)}>
        <div className="z-10 flex flex-col items-center text-center max-w-lg space-y-10">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                   {title.split('\n').map((line, i) => (
                     <span key={i} className="block">{line}</span>
                   ))}
                </h1>
                <p className="text-xl font-medium leading-relaxed opacity-90">{description}</p>
            </div>
            {children}
        </div>
    </div>
  );
}

