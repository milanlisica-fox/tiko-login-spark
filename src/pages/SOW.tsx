import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, X, Download } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import { SOW_ASSETS } from "@/constants/sow-assets";
import BriefCard from "@/components/common/BriefCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SuccessDialog from "@/components/common/SuccessDialog";
import { triggerSuccessConfetti } from "@/lib/animations";

const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// SOW document image - Update src/constants/sow-assets.ts with your actual image
const sowDocumentImage = SOW_ASSETS.sowDocument;

export interface SOW {
  id: string;
  title: string;
  projectLead: string;
  date: string;
  status: "ready_to_sign" | "signed";
  icon?: React.ReactNode;
}

export const READY_TO_SIGN_SOWS: SOW[] = [
  {
    id: "1",
    title: "Q7B7 Toolkit",
    projectLead: "John Smith",
    date: "01/05/25",
    status: "ready_to_sign",
    icon: (
      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2" />
      </svg>
    ),
  },
  {
    id: "2",
    title: "Fold Toolkit Q3 2025",
    projectLead: "Murray Gordon",
    date: "15/05/25",
    status: "ready_to_sign",
    icon: (
      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2" />
      </svg>
    ),
  },
  {
    id: "3",
    title: "Buds3 Campaign Toolkit",
    projectLead: "Jane Smith",
    date: "20/05/25",
    status: "ready_to_sign",
    icon: (
      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2" />
      </svg>
    ),
  },
];

export const SIGNED_SOWS: SOW[] = [
  {
    id: "4",
    title: "W Summer Festival 2025",
    projectLead: "Murray Gordon",
    date: "27/08/24",
    status: "signed",
    icon: (
      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2" />
      </svg>
    ),
  },
  {
    id: "5",
    title: "Adapt AI Toolkit Q3 2025",
    projectLead: "John Doe",
    date: "15/09/24",
    status: "signed",
    icon: (
      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2" />
      </svg>
    ),
  },
];

export default function SOWPage() {
  const navigate = useNavigate();
  const { activeName } = useActiveNav();
  const [selectedSOW, setSelectedSOW] = useState<SOW | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate("/dashboard/briefs")} className="hover:opacity-70 transition">
        <ArrowLeft size={20} className="text-black" />
      </button>
      <span className="text-sm leading-[19.6px] text-black">SOW ready to sign</span>
    </div>
  );

  const handleSOWClick = (sow: SOW) => {
    setSelectedSOW(sow);
    setIsDialogOpen(true);
  };

  const handleDownloadSOW = () => {
    // TODO: Implement download SOW functionality
    console.log("Download SOW clicked for:", selectedSOW?.title);
  };

  const handleWriteComments = () => {
    // TODO: Implement write comments functionality
    console.log("Write comments clicked for:", selectedSOW?.title);
  };

  const handleSignSOW = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSignSOW = () => {
    // TODO: Implement sign SOW functionality
    console.log("Sign SOW confirmed for:", selectedSOW?.title);
    setIsConfirmDialogOpen(false);
    setIsDialogOpen(false);
    setIsSuccessDialogOpen(true);
  };

  useEffect(() => {
    if (isSuccessDialogOpen) {
      triggerSuccessConfetti();
    }
  }, [isSuccessDialogOpen]);

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  return (
    <DashboardLayout
      title={titleNode}
      onNavigate={(path) => navigate(path)}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px]">
        <div className="space-y-6 md:space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-1 md:text-center lg:text-left">
            <h1 className="h1-heading text-2xl md:text-h1 text-black">SOW ready to sign</h1>
            <p className="text-sm md:text-body text-black">Review and sign your Statements of Work</p>
          </div>

          {/* SOW ready to Sign Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold leading-[21.28px] text-black">SOW ready to sign</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {READY_TO_SIGN_SOWS.map((sow) => (
                <button
                  key={sow.id}
                  onClick={() => handleSOWClick(sow)}
                  className="card-brief text-left w-full"
                >
                  <BriefCard
                    title={sow.title}
                    description={`Project lead: ${sow.projectLead} • ${sow.date}`}
                    right={sow.icon}
                    className="h-full hover:shadow-md transition cursor-pointer"
                  >
                    <div className="h-px bg-[#ececec]" />
                    <div className="flex items-center justify-between text-xs text-[#848487]">
                      <div className="flex items-center gap-1">
                        <span>📄</span>
                        <span>SOW</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{sow.date}</span>
                      </div>
                    </div>
                  </BriefCard>
                </button>
              ))}
            </div>
          </div>

          {/* SOW Signed Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold leading-[21.28px] text-black">SOW signed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SIGNED_SOWS.map((sow) => (
                <button
                  key={sow.id}
                  onClick={() => handleSOWClick(sow)}
                  className="card-brief text-left w-full"
                >
                  <BriefCard
                    title={sow.title}
                    description={`Project lead: ${sow.projectLead} • ${sow.date}`}
                    right={sow.icon}
                    className="h-full hover:shadow-md transition cursor-pointer opacity-75"
                  >
                    <div className="h-px bg-[#ececec]" />
                    <div className="flex items-center justify-between text-xs text-[#848487]">
                      <div className="flex items-center gap-1">
                        <span>✓</span>
                        <span>Signed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{sow.date}</span>
                      </div>
                    </div>
                  </BriefCard>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOW Document Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-white flex flex-col">
          <div className="p-6 pb-4 shrink-0 relative">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-black pr-10">{selectedSOW?.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Review and sign the Statement of Work document for {selectedSOW?.title}
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute right-4 top-4 md:right-6 md:top-6 w-8 h-8 flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
          
          <div className="px-6 w-full overflow-y-auto flex-1 min-h-0">
            {/* SOW Document Image */}
            <div className="w-full bg-white border border-[#e0e0e0] rounded-lg overflow-hidden shadow-sm">
              <img
                src={sowDocumentImage}
                alt={`SOW Document: ${selectedSOW?.title}`}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-4 border-t border-[#e0e0e0] shrink-0">
            <Button
              onClick={handleDownloadSOW}
              variant="outline"
              className="w-full sm:w-auto bg-[#f9f9f9] border-[#e0e0e0] text-black hover:bg-[#e5e5e5] h-10 px-6 whitespace-nowrap"
            >
              Download SOW
            </Button>
            <Button
              onClick={handleWriteComments}
              variant="outline"
              className="w-full sm:w-auto bg-[#f9f9f9] border-[#e0e0e0] text-black hover:bg-[#e5e5e5] h-10 px-6 whitespace-nowrap"
            >
              Write comments
            </Button>
            <Button
              onClick={handleSignSOW}
              className="w-full sm:w-auto bg-[#ffb546] text-black hover:opacity-90 h-10 px-6 whitespace-nowrap"
            >
              Sign the SOW
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-black">
              Confirm Sign SOW
            </DialogTitle>
            <DialogDescription className="text-sm text-black mt-2">
              Please confirm that you want to sign the SOW. Your name will appear on the SOW page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleConfirmSignSOW}
              className="w-full bg-[#ffb546] text-black hover:opacity-90 h-10 px-6"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onConfirm={handleCloseSuccessDialog}
        title="SOW successfully signed!"
        description="We are now ready to start to work on your project."
        confirmText="Close"
      />
    </DashboardLayout>
  );
}
