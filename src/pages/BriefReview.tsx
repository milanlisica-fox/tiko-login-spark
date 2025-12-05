import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { triggerSuccessConfetti } from "@/lib/animations";
import SuccessDialog from "@/components/common/SuccessDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/constants/branding";
import { BRIEFS_ASSETS } from "@/constants/briefs-assets";
import BriefPreviewPanel from "@/components/briefs/BriefPreviewPanel";
import { format } from "date-fns";
import { PROJECT_LEADS, SubmittedBriefPayload } from "./Briefs";

const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;
const createBriefArrowIcon = BRIEFS_ASSETS.createBriefArrowIcon;

export default function BriefReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);
  const [pendingBriefPayload, setPendingBriefPayload] = useState<SubmittedBriefPayload | null>(null);

  const briefState = (location.state as { brief?: { projectTitle: string; dueDate?: Date; projectLead: string; objective: string } } | undefined)?.brief;

  useEffect(() => {
    if (!briefState) {
      navigate("/dashboard/briefs", { replace: true });
    }
  }, [briefState, navigate]);

  const formattedDueDate = useMemo(() => {
    if (!briefState?.dueDate) {
      return "";
    }
    try {
      return format(new Date(briefState.dueDate), "MMMM d, yyyy");
    } catch (error) {
      return "";
    }
  }, [briefState?.dueDate]);

  const projectLeadLabel = useMemo(() => {
    if (!briefState?.projectLead) {
      return "";
    }
    return PROJECT_LEADS.find((lead) => lead.value === briefState.projectLead)?.label ?? briefState.projectLead;
  }, [briefState?.projectLead]);

  // Mock of captured brief data (can be replaced by routed state/global store later)
  const briefData = {
    projectTitle: briefState?.projectTitle ?? "",
    dueDate: formattedDueDate,
    projectLead: projectLeadLabel,
    objective: briefState?.objective ?? "",
  };

  const buildPayload = (status: "draft" | "in-review"): SubmittedBriefPayload => ({
    title: briefData.projectTitle || "Untitled brief",
    objective: briefData.objective,
    status,
    dueDate: briefState?.dueDate ? new Date(briefState.dueDate).toISOString() : undefined,
  });

  const handleSubmit = () => {
    setPendingBriefPayload(buildPayload("in-review"));
    setShowConfirmation(true);
  };

  const handleEdit = () => {
    navigate("/dashboard/briefs", {
      state: {
        createBrief: true,
        showForm: true,
        brief: briefState,
      },
    });
  };

  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    if (pendingBriefPayload) {
      navigate("/dashboard/briefs", { state: { submittedBrief: pendingBriefPayload } });
      setPendingBriefPayload(null);
    } else {
      navigate("/dashboard/briefs", { state: { resetToOverview: true } });
    }
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  useEffect(() => {
    if (showSaveDraftConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showSaveDraftConfirmation]);

  const handleSaveDraft = () => {
    setPendingBriefPayload(buildPayload("draft"));
    setShowSaveDraftConfirmation(true);
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    if (pendingBriefPayload) {
      navigate("/dashboard/briefs", { state: { submittedBrief: pendingBriefPayload } });
      setPendingBriefPayload(null);
    } else {
      navigate("/dashboard/briefs", { state: { resetToOverview: true } });
    }
  };

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
        <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
          <div className="flex flex-row gap-4 w-full h-full">
            {/* Left: read-only form summary */}
            <div className="flex flex-col gap-2 p-4 md:p-6 rounded-xl flex-[1_1_0%] min-w-0 h-full overflow-hidden">
            <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
              <p className="text-sm leading-[18.62px] text-[#424242] w-full">Review the details of your brief before submitting.</p>

              <div className="flex flex-col gap-6">
                {/* Project Title */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Project title</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                    {briefData.projectTitle || "-"}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Delivery date</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                    {briefData.dueDate || "Pick a date"}
                  </div>
                </div>

                {/* Project Lead */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Project lead*</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                    {briefData.projectLead || "-"}
                  </div>
                </div>

                {/* Objective */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Objective</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-lg px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a] min-h-[74px]">
                    {briefData.objective || "-"}
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Right: brief preview */}
            <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
            <div className="bg-white flex flex-col gap-6 p-6 rounded-xl overflow-hidden h-[89%]">
              <div className="flex-1 overflow-y-auto">
                <BriefPreviewPanel
                  projectTitle={briefData.projectTitle}
                  launchDate={briefData.dueDate}
                  projectLead={briefData.projectLead}
                  objective={briefData.objective}
                />
              </div>
            </div>

            <div className="flex items-center w-full min-w-0 gap-2">
              <button
                onClick={handleEdit}
                className="w-[25%] min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Edit brief</span>
              </button>
              <div className="w-[15%] shrink-0" />
              <button
                onClick={handleSubmit}
                className="btn w-[60%] min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Submit brief</span>
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Tablet/iPad Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
        <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
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
                    {briefData.projectTitle || "-"}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Delivery date</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                    {briefData.dueDate || "Pick a date"}
                  </div>
                </div>

                {/* Project Lead */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Project lead*</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a]">
                    {briefData.projectLead || "-"}
                  </div>
                </div>

                {/* Objective */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">Objective</Label>
                  </div>
                  <div className="border border-[#e0e0e0] rounded-lg px-5 py-2.5 bg-[#f9f9f9] text-sm text-[#09090a] min-h-[74px]">
                    {briefData.objective || "-"}
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
                <BriefPreviewPanel
                  projectTitle={briefData.projectTitle}
                  launchDate={briefData.dueDate}
                  projectLead={briefData.projectLead}
                  objective={briefData.objective}
                />

                {/* Separator */}
                <div className="h-[9px] relative w-full shrink-0">
                  <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
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
            <div className="flex flex-row items-center gap-2.5 w-full min-w-0">
              <button
                onClick={handleEdit}
                className="flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Edit brief</span>
              </button>
              <div className="w-[15%] shrink-0" />
              <button
                onClick={handleSubmit}
                className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Submit brief</span>
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
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
        <SuccessDialog
          open={showSaveDraftConfirmation}
          onOpenChange={setShowSaveDraftConfirmation}
          onConfirm={handleViewAllBriefsFromSave}
        />
      </>
    </DashboardLayout>
  );
}


