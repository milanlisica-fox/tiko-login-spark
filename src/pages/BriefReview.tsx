import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { triggerSuccessConfetti } from "@/lib/animations";
import SuccessDialog from "@/components/common/SuccessDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/constants/branding";
import { BRIEFS_ASSETS } from "@/constants/briefs-assets";

const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;
const createBriefArrowIcon = BRIEFS_ASSETS.createBriefArrowIcon;

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
  const handleEdit = () => navigate("/dashboard/briefs", { state: { createBrief: true, showForm: true } });

  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate("/dashboard/briefs", { state: { createBrief: true, showForm: true } })} className="hover:opacity-70 transition">
        <ArrowLeft size={20} className="text-black" />
      </button>
      <span className="text-sm leading-[19.6px] text-black">Brief review</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      onNavigate={(path) => navigate(path)}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <>
        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-[15%] overflow-hidden">
          <div className="flex flex-row gap-0 w-full max-w-full h-full">
            {/* Left: read-only form summary */}
            <div className="flex flex-col gap-2 p-4 md:p-6 rounded-xl lg:flex-[0_0_564px] h-full overflow-y-auto">
            <div className="flex flex-col gap-4 flex-1">
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

            {/* Right Panel */}
            <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-1 max-w-[540px] h-full overflow-hidden">
            {/* Brief Preview - made smaller to prevent scroll */}
            <div className="bg-white flex flex-col gap-8 p-6 rounded-xl overflow-y-auto h-[89%]">
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

            {/* Separator - matching left side line width and position */}
            <div className="h-[9px] relative w-full shrink-0">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>

            {/* Bottom actions */}
            <div className="flex items-center w-full shrink-0">
              <button
                onClick={handleEdit}
                className="w-[25%] h-8 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Edit brief</span>
              </button>
              <div className="w-[15%]" />
              <button
                onClick={handleSubmit}
                className="w-[60%] h-8 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Submit brief</span>
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Tablet/iPad Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
        <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-[10%] pb-8 pt-4">
          {/* Form Section */}
          <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
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

            {/* Separator line */}
            <div className="h-[9px] relative w-full shrink-0 mt-4">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>
          </div>

          {/* White Document - Shown on mobile and tablet/iPad */}
          <div className="flex lg:hidden flex-col gap-2.5 pb-5 w-full max-w-4xl mt-5">
            {/* Brief Preview - Double height */}
            <div className="bg-white flex flex-col p-6 rounded-xl min-h-[600px] overflow-y-auto">
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

            {/* Separator */}
            <div className="h-[9px] relative w-full shrink-0">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>
          </div>

          {/* Buttons section for mobile and tablet/iPad */}
          <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
            {/* Action Buttons - Order: Edit brief, Submit brief - In a row */}
            <div className="flex flex-row items-center gap-2.5 w-full">
              <button
                onClick={handleEdit}
                className="h-8 px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center flex-1"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Edit brief</span>
              </button>
              <div className="w-[15%]" />
              <button
                onClick={handleSubmit}
                className="flex-1 h-8 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Submit brief</span>
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <SuccessDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          onConfirm={handleViewAllBriefs}
        />
      </>
    </DashboardLayout>
  );
}


