import { AdminLoginForm } from "@/src/components/forms/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#e8ecf7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <AdminLoginForm />
      </div>
    </div>
  );
}
