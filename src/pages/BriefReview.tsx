import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { triggerSuccessConfetti } from "@/lib/animations";
import SuccessDialog from "@/components/common/SuccessDialog";

export default function BriefReview() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock of captured brief data (can be replaced by routed state/global store later)
  const mockBriefData = {
    projectTitle: "Q7B7 Toolkit",
    dueDate: "Pick a date",
    projectLead: "Henry Bray",
    objective:
      "To create a product toolkit that provides clear guidance to help partners effectively amplify the campaign message. The toolkit should enable consistent execution, align with campaign objectives, and make it easy for users to activate the campaign across channels.",
  };

  const deliverablesList = [
    {
      kvType: "Q7 KV",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
    {
      kvType: "B7 KV",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      ],
    },
  ];

  const handleSubmit = () => setShowConfirmation(true);
  const handleEdit = () => navigate(-1);

  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      {/* Content wrapper, matching spacing used in other pages */}
      <main className="flex-1 flex flex-col">
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            <span className="text-sm leading-[19.6px] text-black">Brief review</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
          <div className="flex gap-0 w-full">
            {/* Left: read-only form summary mirroring the create brief form fields */}
            <div className="flex flex-col gap-8 p-6 rounded-xl w-[564px] bg-white">
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-[18.62px] text-[#424242] w-full">Review the details of your brief before submitting.</p>

                <div className="flex flex-col gap-6">
                  {/* Project Title */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Project title</Label>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                      {mockBriefData.projectTitle || "-"}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Due date</Label>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                      {mockBriefData.dueDate || "Pick a date"}
                    </div>
                  </div>

                  {/* Project Lead */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Project lead*</Label>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                      {mockBriefData.projectLead || "-"}
                    </div>
                  </div>

                  {/* Objective */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Objective</Label>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-lg px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a] min-h-[74px]">
                      {mockBriefData.objective || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: simple placeholder panel to match the original two-column layout */}
            <div className="flex flex-col gap-2.5 pb-5 pr-10 pl-2.5 pt-2.5 h-[830px] w-[601px]">
              <div className="bg-white flex-1 flex flex-col gap-8 p-6 rounded-xl min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center">
                    <p className="text-[22px] font-bold leading-[29.26px] text-black">
                      {mockBriefData.projectTitle}
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm leading-[18.62px] text-[#09090a]">
                        <span className="font-bold">Launch date: </span>
                        <span className="font-normal">{mockBriefData.dueDate}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm leading-[18.62px] text-[#09090a]">
                        <span className="font-bold">Project lead: </span>
                        <span className="font-normal">{mockBriefData.projectLead}</span>
                      </p>
                    </div>

                    <p className="text-sm leading-[18.62px] text-[#09090a]">
                      <span className="font-bold">Objective: </span>
                      <span className="font-normal">{mockBriefData.objective}</span>
                    </p>
                  </div>

                  {/* Mock deliverables preview */}
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex gap-2 items-center text-sm font-bold leading-[18.62px] text-black">
                      <p className="flex-1">KV Type</p>
                      <p className="w-[60px]">Variant</p>
                      <p className="w-[200px]">Size</p>
                    </div>
                    <div className="h-px bg-[#e0e0e0]" />
                    {deliverablesList.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        {item.variants.map((variant, vIdx) => (
                          <div key={vIdx}>
                            <div className="flex gap-2 items-center text-[12px] leading-[15.96px] text-black">
                              <p className={`flex-1 ${vIdx === 0 ? "font-bold" : ""}`}>
                                {vIdx === 0 ? item.kvType : " "}
                              </p>
                              <p className="w-[60px] font-normal">{variant.variant}</p>
                              <p className="w-[200px] font-normal">{variant.size}</p>
                            </div>
                            {vIdx < item.variants.length - 1 && (
                              <div className="h-px bg-[#e0e0e0] mt-2" />
                            )}
                          </div>
                        ))}
                        {idx < deliverablesList.length - 1 && (
                          <div className="h-px bg-[#e0e0e0] mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[9px] relative w-full shrink-0">
                <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
              </div>

              {/* Bottom actions: Left = Edit brief (blue); Right = Submit brief (yellow) */}
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={handleEdit}
                  className="px-6 py-[18px] rounded-[28px] flex items-center justify-center gap-2.5 transition h-8"
                  style={{ backgroundColor: "#03B3E2" }}
                >
                  <span className="text-sm font-semibold leading-[18.62px] text-white">Edit brief</span>
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-6 py-[18px] rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition h-8"
                  style={{ backgroundColor: "#FFB546" }}
                >
                  <span className="text-sm font-semibold leading-[18.62px] text-black">Submit brief</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />
    </div>
  );
}


