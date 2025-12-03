import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, X, Download, Send } from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import BriefCard from "@/components/common/BriefCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SuccessDialog from "@/components/common/SuccessDialog";
import { triggerSuccessConfetti } from "@/lib/animations";
import SOWDocument from "@/components/common/SOWDocument";
import { toast } from "sonner";

const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  message: string;
  timestamp: Date;
  isIris?: boolean;
}

export interface SOW {
  id: string;
  title: string;
  projectLead: string;
  date: string;
  status: "ready_to_sign" | "signed";
  icon?: React.ReactNode;
}

// Mock comments for each SOW
const getMockCommentsForSOW = (sowId: string): Comment[] => {
  const baseComments: Record<string, Comment[]> = {
    "1": [
      {
        id: "comment-1-1",
        author: "Iris",
        authorAvatar: "iris",
        message: "Hi! I've reviewed the Q7B7 Toolkit SOW. Everything looks good. Could you confirm the delivery timeline for the key visuals?",
        timestamp: new Date(2025, 11, 8, 10, 30),
        isIris: true,
      },
      {
        id: "comment-1-2",
        author: "Samsung",
        authorAvatar: "samsung",
        message: "Thanks for the review! We're targeting Week 50 for the key visuals. The rest of the toolkit can follow in early January.",
        timestamp: new Date(2025, 11, 8, 14, 15),
        isIris: false,
      },
      {
        id: "comment-1-3",
        author: "Iris",
        authorAvatar: "iris",
        message: "Perfect! That timeline works well for us. I'll make sure the team is aligned on this schedule.",
        timestamp: new Date(2025, 11, 9, 9, 20),
        isIris: true,
      },
    ],
    "2": [
      {
        id: "comment-2-1",
        author: "Iris",
        authorAvatar: "iris",
        message: "I've reviewed the Fold Toolkit Q3 2025 SOW. The scope looks comprehensive. Do you have specific brand guidelines we should follow for this project?",
        timestamp: new Date(2025, 11, 15, 11, 0),
        isIris: true,
      },
      {
        id: "comment-2-2",
        author: "Samsung",
        authorAvatar: "samsung",
        message: "Yes, we'll share the brand guidelines document by end of week. It includes the latest Fold branding standards and color specifications.",
        timestamp: new Date(2025, 11, 15, 15, 30),
        isIris: false,
      },
      {
        id: "comment-2-3",
        author: "Iris",
        authorAvatar: "iris",
        message: "Great! Once we receive the guidelines, we'll align all assets accordingly. Looking forward to getting started.",
        timestamp: new Date(2025, 11, 16, 10, 45),
        isIris: true,
      },
    ],
    "3": [
      {
        id: "comment-3-1",
        author: "Iris",
        authorAvatar: "iris",
        message: "Hi! I've reviewed the Buds3 Campaign Toolkit SOW. The deliverables list is clear. Could you provide more details on the target markets for localization?",
        timestamp: new Date(2025, 11, 20, 9, 15),
        isIris: true,
      },
      {
        id: "comment-3-2",
        author: "Samsung",
        authorAvatar: "samsung",
        message: "We're targeting 15 markets across Europe and Asia-Pacific. I'll send you the detailed market list and localization requirements separately.",
        timestamp: new Date(2025, 11, 20, 13, 45),
        isIris: false,
      },
      {
        id: "comment-3-3",
        author: "Iris",
        authorAvatar: "iris",
        message: "Perfect! That will help us plan the localization work efficiently. Please send it when ready.",
        timestamp: new Date(2025, 11, 21, 8, 30),
        isIris: true,
      },
    ],
    "4": [
      {
        id: "comment-4-1",
        author: "Iris",
        authorAvatar: "iris",
        message: "The W Summer Festival 2025 SOW has been signed and we've started work on the project. Initial concepts will be ready for review next week.",
        timestamp: new Date(2024, 7, 28, 10, 0),
        isIris: true,
      },
      {
        id: "comment-4-2",
        author: "Samsung",
        authorAvatar: "samsung",
        message: "Excellent! Looking forward to seeing the concepts. The team is excited about this campaign.",
        timestamp: new Date(2024, 7, 28, 16, 20),
        isIris: false,
      },
    ],
    "5": [
      {
        id: "comment-5-1",
        author: "Iris",
        authorAvatar: "iris",
        message: "The Adapt AI Toolkit Q3 2025 SOW is signed and we're proceeding with the deliverables. All assets are on track for the agreed timeline.",
        timestamp: new Date(2024, 8, 16, 11, 30),
        isIris: true,
      },
      {
        id: "comment-5-2",
        author: "Samsung",
        authorAvatar: "samsung",
        message: "Thank you for the update! Keep us posted on progress.",
        timestamp: new Date(2024, 8, 16, 14, 15),
        isIris: false,
      },
    ],
  };
  return baseComments[sowId] || [];
};

export const READY_TO_SIGN_SOWS: SOW[] = [
  {
    id: "1",
    title: "Q7B7 Toolkit",
    projectLead: "John Smith",
    date: "10/12/25",
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
    date: "18/12/25",
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
    date: "22/12/25",
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
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");

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
    // Initialize comments for this SOW if not already loaded
    if (!comments[sow.id]) {
      setComments((prev) => ({
        ...prev,
        [sow.id]: getMockCommentsForSOW(sow.id),
      }));
    }
    setNewComment("");
  };

  const handleDownloadSOW = () => {
    // TODO: Implement download SOW functionality
    console.log("Download SOW clicked for:", selectedSOW?.title);
  };

  const handlePostComment = () => {
    if (!selectedSOW || !newComment.trim()) {
      return;
    }

    const comment: Comment = {
      id: `comment-${selectedSOW.id}-${Date.now()}`,
      author: "Samsung",
      authorAvatar: "samsung",
      message: newComment.trim(),
      timestamp: new Date(),
      isIris: false,
    };

    setComments((prev) => ({
      ...prev,
      [selectedSOW.id]: [...(prev[selectedSOW.id] || []), comment],
    }));
    setNewComment("");
    toast.success("Comment posted successfully");
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
          
          <div className="px-6 w-full overflow-y-auto flex-1 min-h-0 space-y-6">
            {/* SOW Document */}
            {selectedSOW && (
              <div className="w-full bg-white border border-[#e0e0e0] rounded-lg overflow-hidden shadow-sm">
                <SOWDocument sow={selectedSOW} />
              </div>
            )}

            {/* Comments Section */}
            {selectedSOW && (
              <div className="w-full bg-white border border-[#ececec] rounded-2xl p-4 md:p-6 space-y-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[21.6px] font-semibold text-black">Comments</h3>
                  <p className="text-sm text-[#424242]">Exchange messages with Iris about this SOW.</p>
                </div>

                {/* Comments List */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
                  {(comments[selectedSOW.id] || []).map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex gap-3 ${comment.isIris ? "flex-row" : "flex-row-reverse"}`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/personas/png?seed=${comment.authorAvatar}&size=64`}
                            alt={comment.author}
                          />
                          <AvatarFallback className="text-sm bg-gradient-to-br from-blue-200 to-blue-300">
                            {comment.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Message Bubble */}
                      <div className={`flex flex-col gap-1 flex-1 ${comment.isIris ? "items-start" : "items-end"}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-black">{comment.author}</span>
                          <span className="text-xs text-[#848487]">
                            {format(comment.timestamp, "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <div
                          className={`rounded-xl px-4 py-3 max-w-[80%] ${
                            comment.isIris
                              ? "bg-[#efeff0] text-black"
                              : "bg-[#03b3e2] text-white"
                          }`}
                        >
                          <p className="text-sm leading-[18.62px] whitespace-pre-wrap">{comment.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex flex-col gap-3 pt-4 border-t border-[#ececec]">
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/personas/png?seed=samsung&size=64"
                          alt="Samsung"
                        />
                        <AvatarFallback className="text-sm bg-gradient-to-br from-blue-200 to-blue-300">
                          S
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="border-[#e0e0e0] rounded-lg px-4 py-3 min-h-[80px] resize-none bg-white text-black placeholder:text-[#848487]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            handlePostComment();
                          }
                        }}
                      />
                      <div className="flex items-center justify-end">
                        <button
                          onClick={handlePostComment}
                          disabled={!newComment.trim()}
                          className={`px-6 py-2 rounded-[28px] text-sm font-semibold transition flex items-center gap-2 ${
                            newComment.trim()
                              ? "bg-[#03b3e2] text-white hover:opacity-90"
                              : "bg-[#f4f4f5] text-[#9c9c9f] cursor-not-allowed"
                          }`}
                        >
                          <Send size={16} />
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-4 border-t border-[#e0e0e0] shrink-0">
            <Button
              onClick={handleDownloadSOW}
              variant="outline"
              className="w-full sm:w-auto bg-[#f9f9f9] border-[#e0e0e0] text-black hover:bg-[#e5e5e5] h-10 px-6 whitespace-nowrap"
            >
              Download SOW
            </Button>
            {selectedSOW?.status === "ready_to_sign" && (
              <Button
                onClick={handleSignSOW}
                className="w-full sm:w-auto bg-[#ffb546] text-black hover:opacity-90 h-10 px-6 whitespace-nowrap"
              >
                Sign the SOW
              </Button>
            )}
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
