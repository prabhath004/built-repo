import { Analyzer } from "@/components/analyzer";

export default function IntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">New Intake</h1>
        <p className="text-sm text-slate-500">
          Paste messy onboarding notes and generate an implementation plan.
        </p>
      </div>
      <Analyzer />
    </div>
  );
}
