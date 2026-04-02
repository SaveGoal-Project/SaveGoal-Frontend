import { Activity, LockKeyhole, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/src/components/forms/AdminLoginForm";
import { Card, CardContent } from "@/src/components/ui/card";

const adminSignals = [
  {
    icon: ShieldCheck,
    title: "Role-protected access",
    description: "Only verified admins can enter the operations workspace.",
  },
  {
    icon: Activity,
    title: "Live platform oversight",
    description: "Monitor merchants, payouts, disputes, and risk decisions in one place.",
  },
  {
    icon: LockKeyhole,
    title: "Audited sessions",
    description: "Every sensitive action is traceable for compliance and support review.",
  },
];

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <Card className="w-full overflow-hidden border-white/10 bg-white shadow-2xl shadow-slate-950/40">
          <CardContent className="grid p-0 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative hidden overflow-hidden bg-slate-950 px-8 py-10 text-white lg:flex lg:min-h-[700px] lg:flex-col lg:justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%)]" />

              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-950">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      SaveGoal Control Center
                    </p>
                    <p className="text-base font-semibold">
                      Admin workspace access
                    </p>
                  </div>
                </div>

                <div className="max-w-md space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight">
                    Review platform activity without fighting the login screen.
                  </h1>
                  <p className="text-base leading-7 text-slate-300">
                    The admin dashboard handles sensitive workflows, so the
                    sign-in experience should feel clear, fast, and trustworthy
                    on both desktop and mobile.
                  </p>
                </div>
              </div>

              <div className="relative grid gap-4">
                {adminSignals.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex min-h-[640px] items-center bg-white px-6 py-10 sm:px-10 lg:px-12">
              <AdminLoginForm />
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
