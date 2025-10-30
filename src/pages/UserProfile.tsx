import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, ArrowRight, User, Bell, Coins, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HBAvatar from "@/components/common/HBAvatar";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import { BRAND } from "@/constants/branding";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// User profile images from Figma
const avatarImg1 = "https://www.figma.com/api/mcp/asset/8f703c7e-bd75-44c9-bfd6-7bd2a9304ada";
const avatarImg2 = "https://www.figma.com/api/mcp/asset/2763df3c-aa1d-46a3-9d19-01de3eb309ce";
const avatarImg3 = "https://www.figma.com/api/mcp/asset/5f1cd9b1-b890-4390-b9ff-3fe087d29156";
const avatarImg4 = "https://www.figma.com/api/mcp/asset/53abf7b2-6c6b-4ef3-bf18-7f9b9cac4259";
const avatarImg5 = "https://www.figma.com/api/mcp/asset/2e66cac4-69b5-438a-902e-e67ab3e96398";
const avatarImg6 = "https://www.figma.com/api/mcp/asset/7f1d849e-2ca5-4a46-84f5-58471a3d22e0";
const avatarImg7 = "https://www.figma.com/api/mcp/asset/12537ceb-3e87-4177-ba70-2f4327f82a9d";
const avatarImg8 = "https://www.figma.com/api/mcp/asset/7d56ad85-fdba-4eff-a947-e598dd95d31a";
const avatarImg9 = "https://www.figma.com/api/mcp/asset/9eede916-3b76-46a7-9bbe-bf96d8a6bbac";
const avatarImg10 = "https://www.figma.com/api/mcp/asset/8658d57f-28bb-4997-bb12-20725b27456b";
const avatarImg11 = "https://www.figma.com/api/mcp/asset/2998cbe3-c3ae-487b-8686-a8789842a274";
const avatarImg12 = "https://www.figma.com/api/mcp/asset/4af55757-996e-4874-851d-9f0552a2e4a8";
const avatarImg13 = "https://www.figma.com/api/mcp/asset/483c629a-d2e6-4414-b0f3-74c653bace3c";
const avatarImg14 = "https://www.figma.com/api/mcp/asset/5b9c783c-436b-442e-9857-06d309940de1";
const avatarImg15 = "https://www.figma.com/api/mcp/asset/f74354e7-ae07-4777-8f6a-2ee0b12ea289";
const avatarImg16 = "https://www.figma.com/api/mcp/asset/2e7d8b8d-62c1-48ea-a235-e45817dde115";
const avatarImg17 = "https://www.figma.com/api/mcp/asset/846c0f66-a6ab-4924-b5b3-29fe3c Hoffmann85愉悦";
const avatarImg18 = "https://www.figma.com/api/mcp/asset/56c68c66-b882-4196-b347-677d401b49da";
const avatarImg19 = "https://www.figma.com/api/mcp/asset/dc9b97c8-f3c8-41eb-b2ca-c36e2fedc0df";
const avatarImg20 = "https://www.figma.com/api/mcp/asset/11300247-38f8-478d-9479-40935b534eef";
const avatarImg21 = "https://www.figma.com/api/mcp/asset/51b54793-bcea-4985-bc14-75237d0帖3404";
const arrowRightIcon = "https://www.figma.com/api/mcp/asset/8d6284a1-722e-4575-b9f8-e41d481a0036";

// Hover state avatar images from Figma
const avatarHoverImg1 = "https://www.figma.com/api/mcp/asset/407be802-dcd7-4078-90fa-ac28c700f8eb";
const avatarHoverImg2 = "https://www.figma.com/api/mcp/asset/b8c19f34-1027-4e1e-a267-dcc3918c60ad";
const avatarHoverImg3 = "https://www.figma.com/api/mcp/asset/734766d8-1010-46a3-9bc5-8cd51ca0ac2a";
const avatarHoverImg4 = "https://www.figma.com/api/mcp/asset/4081fb17-afab-45e9-af1d-2a0f6d1c85b0";
const avatarHoverImg5 = "https://www.figma.com/api/mcp/asset/382a53a5-c097-47b0-a003-bf64f321c4cb";

// Dialog avatar images from Figma
const dialogAvatarImg1 = "https://www.figma.com/api/mcp/asset/Yet72f778fd-4f0f-400d-8b5b-13116d321c50";
const dialogAvatarImg2 = "https://www.figma.com/api/mcp/asset/4893e373-71e6-4fb7-b53a-56fc52dfeb42";
const dialogAvatarImg3 = "https://www.figma.com/api/mcp/asset/eace1dce-6e7b-47de-893c-ad63627f2688";
const dialogAvatarImg4 = "https://www.figma.com/api/mcp/asset/b9e47adb-9894-4768-9595-8784ac6223ff";
const dialogAvatarImg5 = "https://www.figma.com/api/mcp/asset/828ea941-738b-4109-9ace-f7cec7a5bac7";
const uploadIcon = "https://www.figma.com/api/mcp/asset/ddbd83a4-2dd8-426f-9875-8383e44a9aa0";
const deleteIcon = "https://www.figma.com/api/mcp/asset/f07e3248-cac6-46be-bc96-60eec0848c5d";
const dividerLine = "https://www.figma.com/api/mcp/asset/e2a2fcaa-d006-4987-a053-d9609ffc1a58";
const closeIcon = "https://www.figma.com/api/mcp/asset/da3bf0f3-859a-44ec-a211-7e6bcf5021ee";

// Password section removed

export default function UserProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [tempAvatarSrc, setTempAvatarSrc] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // nav items centralized via DashboardLayout

  const activeName = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/briefs")) return "Briefs";
    if (location.pathname === "/dashboard") return "Central";
    if (location.pathname.startsWith("/dashboard/projects")) return "Projects";
    if (location.pathname.startsWith("/dashboard/tracker")) return "Tracker";
    if (location.pathname.startsWith("/dashboard/profile")) return "My account";
    return "Central";
  }, [location.pathname]);

  const handleChangeEmail = () => {
    toast.info("Change email functionality coming soon");
  };

  // Change password functionality removed

  const topbarRight = (
    <>
      <NotificationsPopover />
      <div className="flex items-center gap-1">
        <Coins size={20} className="text-[#848487]" />
        <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
      </div>
      <button onClick={() => navigate("/dashboard/profile")} className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
        <HBAvatar size={40} src={avatarSrc} />
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-[18.62px] text-[#646464]">Henry Bray</p>
          <p className="text-xs leading-[15.96px] text-[#646464]">Marcomms</p>
        </div>
        <ChevronDown size={24} className="text-[#646464] rotate-90" />
      </button>
    </>
  );

  const titleNode = (
    <div className="flex items-center gap-2">
      <User size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">My account</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-6 pt-[40px] pb-[40px]">
        <div className="max-w-[662px] flex flex-col gap-[40px]">
            {/* User Header */}
            <div className="flex gap-[24px] items-center">
              {/* Avatar */}
              <div
                className="h-[120px] w-[120px] rounded-full cursor-pointer group relative shrink-0"
                onClick={() => { setTempAvatarSrc(avatarSrc); setIsPhotoDialogOpen(true); }}
              >
                <HBAvatar size={120} className="rounded-full" src={avatarSrc} />
                {/* Hover overlay with "Add photo" text */}
                <div className="absolute inset-0 bg-[rgba(131,110,110,0.7)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                  <p
                    className="text-[22px] font-bold leading-[29.26px] text-[#fcfcff] not-italic"
                    style={{ textShadow: '0px 1px 4px rgba(0,0,0,0.25)' }}
                  >
                    Add photo
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-1 flex-col gap-[4px]">
                <h1 className="text-h1 text-black">
                  Henry Bray
                </h1>
                <p className="text-body text-black">
                  Marcomms
                </p>
              </div>
            </div>

            {/* Profile Cards */}
            <div className="flex flex-col gap-[20px]">
              {/* Email Card */}
              <Card className="bg-white border-0 rounded-[12px] shadow-none">
                <CardContent className="p-[24px]">
                  <div className="flex gap-[16px] items-start justify-between pb-[4px]">
                    <div className="flex flex-1 flex-col gap-[4px]">
                      <h3 className="text-[22px] font-bold leading-[29.26px] text-black">
                        Email
                      </h3>
                      <p className="text-sm leading-[18.62px] text-black">
                        henry.bray@marcomms-samsung.com
                      </p>
                    </div>
                    <Button
                      onClick={handleChangeEmail}
                      variant="ghost"
                      className="backdrop-blur-[6px] flex gap-[8px] h-[24px] items-center justify-center rounded-[28px] hover:bg-transparent p-0"
                    >
                      <span className="text-[12px] font-semibold leading-[23.94px] text-[#848487]">
                        Change
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <img src={arrowRightIcon} alt="" className="block max-w-none size-full" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Password section removed */}

              {/* Access Card */}
              <Card className="bg-white border-0 rounded-[12px] shadow-none">
                <CardContent className="p-[24px]">
                  <div className="flex gap-[16px] items-start justify-between pb-[4px]">
                    <div className="flex flex-1 flex-col gap-[4px]">
                      <h3 className="text-[22px] font-bold leading-[29.26px] text-black">
                        Access
                      </h3>
                      <p className="text-sm leading-[18.62px] text-black">
                        Member
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        
      {/* Change Photo Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="bg-white p-[40px] rounded-[26px] shadow-[0px_13px_61px_0px_rgba(169,169,169,0.37)] max-w-[600px] border-0 backdrop-blur [&>button]:hidden">
          <style>{`
            [data-radix-dialog-overlay] {
              backdrop-filter: blur(4px);
              background-color: rgba(0, 0, 0, 0.4) !important;
            }
          `}</style>
          {/* Close button */}
          <button
            onClick={() => setIsPhotoDialogOpen(false)}
            className="absolute right-[20px] top-[20px] p-[16px] rounded-[8px] hover:bg-gray-100 transition cursor-pointer z-10"
          >
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <img src={closeIcon} alt="Close" className="block max-w-none size-full" />
            </div>
          </button>

          <div className="flex flex-col gap-[40px]">
            {/* Title */}
            <h2 className="text-[28px] font-bold leading-[37.24px] text-black">
              Change your profile picture
            </h2>

            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[40px]">
                {/* Avatar Preview and Actions */}
                <div className="flex flex-col gap-[40px] items-center">
                  {/* Large Avatar Preview */}
                  <HBAvatar size={160} src={tempAvatarSrc} />

                  {/* Upload and Remove Buttons */}
                  <div className="flex gap-[40px] items-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (file.size > 1024 * 1024) {
                          toast.error("Max file size is 1 MB");
                          e.currentTarget.value = "";
                          return;
                        }
                        if (!file.type.startsWith("image/")) {
                          toast.error("Please select an image file");
                          e.currentTarget.value = "";
                          return;
                        }
                        const objectUrl = URL.createObjectURL(file);
                        setTempAvatarSrc((prev) => {
                          if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                          return objectUrl;
                        });
                      }}
                    />
                    <button className="flex gap-[4px] items-start hover:opacity-80 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="overflow-clip relative shrink-0 size-[20px]">
                        <img src={uploadIcon} alt="Upload" className="block max-w-none size-full" />
                      </div>
                      <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                        Upload
                      </p>
                    </button>
                    <button className="flex gap-[4px] items-start hover:opacity-80 transition cursor-pointer" onClick={() => {
                      setTempAvatarSrc((prev) => {
                        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                        return undefined;
                      });
                    }}>
                      <div className="overflow-clip relative shrink-0 size-[20px]">
                        <img src={deleteIcon} alt="Remove" className="block max-w-none size-full" />
                      </div>
                      <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                        Remove
                      </p>
                    </button>
                  </div>
                </div>

                {/* Divider and File Info */}
                <div className="flex flex-col gap-[8px]">
                  <div className="h-px relative">
                    <div className="absolute bottom-[25%] left-[-0.05%] right-[-0.05%] top-[25%]">
                      <img src={dividerLine} alt="" className="block max-w-none size-full" />
                    </div>
                  </div>
                  <p className="text-[14px] leading-normal opacity-[0.826] text-[#434343]">
                    Max file size: 1 MB · Recommended size: 240 × 240 px
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-[10px] items-center">
                <Button
                  onClick={() => setIsPhotoDialogOpen(false)}
                  className="flex-1 h-[32px] bg-[#f1f1f3] hover:bg-[#e5e5e5] backdrop-blur-[6px] rounded-[28px] px-[24px] py-[18px]"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">
                    Cancel
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    setAvatarSrc((prev) => {
                      if (prev && prev.startsWith("blob:") && prev !== tempAvatarSrc) {
                        URL.revokeObjectURL(prev);
                      }
                      return tempAvatarSrc;
                    });
                    toast.success("Profile picture saved");
                    setIsPhotoDialogOpen(false);
                  }}
                  className="flex-1 h-[32px] bg-[#f9f9f9] hover:bg-[#e5e5e5] backdrop-blur-[6px] rounded-[28px] px-[24px] py-[18px]"
                >
                  <span className="text-[14px] font-semibold leading-[18.62px] text-[#848487]">
                    Save
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
}
