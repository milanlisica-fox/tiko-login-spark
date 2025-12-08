import { Scope } from "@/pages/SOW";
import { BRAND } from "@/constants/branding";

interface ScopeDocumentProps {
  scope: Scope;
}

export default function ScopeDocument({ scope }: ScopeDocumentProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="w-full bg-white p-8 md:p-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between mb-6">
          <img src={BRAND.logo} alt="TIKO Logo" className="h-8" />
          <div className="text-sm text-[#848487]">Statement of Work</div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">{scope.title}</h1>
        <p className="text-sm text-[#848487]">Project Lead: {scope.projectLead}</p>
      </div>

      {/* Document Date */}
      <div className="mb-8">
        <p className="text-sm text-[#848487] mb-1">Date:</p>
        <p className="text-base text-black font-medium">{formatDate(scope.date)}</p>
      </div>

      {/* Project Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">1. Project Overview</h2>
        <div className="space-y-4 text-sm text-black leading-relaxed">
          <p>
            This Statement of Work (Scope) outlines the scope of work, deliverables, timeline, and terms for the {scope.title} project.
          </p>
          <p>
            The project will be led by <strong>{scope.projectLead}</strong> and executed in accordance with the specifications detailed below.
          </p>
        </div>
      </section>

      {/* Scope of Work */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">2. Scope of Work</h2>
        <div className="space-y-3 text-sm text-black leading-relaxed">
          <p>The scope of work includes, but is not limited to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Development and execution of project deliverables as specified</li>
            <li>Coordination with project stakeholders and team members</li>
            <li>Regular progress updates and milestone reporting</li>
            <li>Quality assurance and review processes</li>
            <li>Final delivery and documentation</li>
          </ul>
        </div>
      </section>

      {/* Deliverables */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">3. Deliverables</h2>
        <div className="space-y-3">
          <div className="border border-[#e0e0e0] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#03B3E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-semibold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black mb-1">Project Assets</h3>
                <p className="text-xs text-[#848487]">Complete set of project assets and deliverables</p>
              </div>
            </div>
          </div>
          <div className="border border-[#e0e0e0] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#03B3E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-semibold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black mb-1">Documentation</h3>
                <p className="text-xs text-[#848487]">Comprehensive project documentation and guidelines</p>
              </div>
            </div>
          </div>
          <div className="border border-[#e0e0e0] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#03B3E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-semibold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black mb-1">Final Review</h3>
                <p className="text-xs text-[#848487]">Final review and approval process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">4. Timeline</h2>
        <div className="space-y-3 text-sm text-black">
          <div className="flex items-center gap-4 pb-3 border-b border-[#e0e0e0]">
            <div className="w-24 text-[#848487]">Start Date:</div>
            <div className="font-medium">{formatDate(scope.date)}</div>
          </div>
          <div className="flex items-center gap-4 pb-3 border-b border-[#e0e0e0]">
            <div className="w-24 text-[#848487]">Target Completion:</div>
            <div className="font-medium">To be determined</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-[#848487]">Status:</div>
            <div className="font-medium">
              {scope.status === "ready_to_sign" ? "Ready to Sign" : "Signed"}
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">5. Terms and Conditions</h2>
        <div className="space-y-3 text-sm text-black leading-relaxed">
          <p>
            By signing this Statement of Work, both parties agree to the terms and conditions outlined herein.
          </p>
          <p>
            All deliverables will be subject to review and approval processes as defined in the project scope.
          </p>
          <p>
            Any changes to the scope of work must be agreed upon in writing by both parties.
          </p>
        </div>
      </section>

      {/* Signature Section */}
      <section className="mt-12 pt-8 border-t-2 border-[#e0e0e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold text-black mb-6">Client Signature</h3>
            <div className="space-y-4">
              <div className="border-b-2 border-[#848487] pb-2 min-h-[60px] flex items-end">
                {scope.signatures?.client ? (
                  <p className="text-base text-black font-semibold italic" style={{ fontFamily: 'cursive' }}>
                    {scope.signatures.client.signature}
                  </p>
                ) : null}
              </div>
              <p className="text-xs text-[#848487]">Signature</p>
              <div className="border-b border-[#e0e0e0] pb-2 mt-4">
                <p className="text-sm text-black font-medium">
                  {scope.signatures?.client?.name || scope.projectLead}
                </p>
              </div>
              <p className="text-xs text-[#848487]">Name</p>
              <div className="border-b border-[#e0e0e0] pb-2 mt-4">
                <p className="text-sm text-black">
                  {scope.signatures?.client?.date || formatDate(scope.date)}
                </p>
              </div>
              <p className="text-xs text-[#848487]">Date</p>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-black mb-6">Vendor Signature</h3>
            <div className="space-y-4">
              <div className="border-b-2 border-[#848487] pb-2 min-h-[60px] flex items-end">
                {scope.signatures?.vendor ? (
                  <p className="text-base text-black font-semibold italic" style={{ fontFamily: 'cursive' }}>
                    {scope.signatures.vendor.signature}
                  </p>
                ) : null}
              </div>
              <p className="text-xs text-[#848487]">Signature</p>
              <div className="border-b border-[#e0e0e0] pb-2 mt-4">
                <p className="text-sm text-black font-medium">
                  {scope.signatures?.vendor?.name || "TIKO Team"}
                </p>
              </div>
              <p className="text-xs text-[#848487]">Name</p>
              <div className="border-b border-[#e0e0e0] pb-2 mt-4">
                <p className="text-sm text-black">
                  {scope.signatures?.vendor?.date || formatDate(scope.date)}
                </p>
              </div>
              <p className="text-xs text-[#848487]">Date</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-[#e0e0e0] text-center">
        <p className="text-xs text-[#848487]">
          This document is confidential and proprietary. Unauthorized distribution is prohibited.
        </p>
      </div>
    </div>
  );
}

