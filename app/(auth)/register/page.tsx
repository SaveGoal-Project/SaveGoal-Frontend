import { RegisterForm } from "@/src/components/forms/RegisterForm";
import { AuthSidebar } from "@/src/components/layouts/AuthSidebar";
import { Check } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const features = [
    "Secure mobile money payments",
    "Track progress in real time",
    "Zero interest on savings",
    "No credit checks required",
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AuthSidebar
        title="Start Your Savings Journey"
        description="Join thousands of Ghanaians who are saving smarter and owning what they love."
      >
        <div className="flex flex-col space-y-6 mt-8 w-full max-w-md">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-[50px] w-[50px] rounded-full border-2 border-white flex items-center justify-center">
                 <Check className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-normal text-white">{feature}</span>
            </div>
          ))}
        </div>
      </AuthSidebar>

      <div className="flex-1 flex flex-col relative bg-white overflow-y-auto h-screen">
         <div className="absolute top-8 left-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium">
               Back to home
            </Link>
         </div>
         
         <div className="flex-1 flex justify-center items-center px-8 lg:px-16 py-12">
            <RegisterForm />
         </div>
      </div>
    </div>
  );
}
