import { LoginForm } from "@/src/components/forms/LoginForm";
import { AuthSidebar } from "@/src/components/layouts/AuthSidebar";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Fixed Left Sidebar */}
      <AuthSidebar
        title="Welcome To SaveGoal"
        description="You've been missed! Sign In to continue saving towards your goals"
      >
        <div className="mt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Save for What You Want. Buy
            <br />
            When You&apos;re Ready.
          </h2>
        </div>
      </AuthSidebar>

      {/* Scrollable Right Side - offset by sidebar width on large screens */}
      <div className="lg:ml-[50%] min-h-screen bg-white overflow-y-auto flex items-center justify-center">
        <div className="w-full px-8 lg:px-16 py-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

