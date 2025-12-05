import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import { Field } from "@/components/common/Field";
import { StyledInput } from "@/components/common/StyledInput";
import { Input } from "@/components/ui/input";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

export default function ClientConfigurationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [clientName, setClientName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [mondayApiToken, setMondayApiToken] = useState("");
  const [mondayBoardId, setMondayBoardId] = useState("");

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  const handleUploadLogo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      setLogoPreview(blobUrl);
      toast.success("Logo uploaded successfully");
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    toast.success("Logo removed");
  };

  const handleColorChange = (color: string, type: "primary" | "secondary") => {
    // Validate hex color format
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexPattern.test(color)) {
      if (type === "primary") {
        setPrimaryColor(color);
      } else {
        setSecondaryColor(color);
      }
    } else if (color.length <= 7) {
      // Allow partial input while typing
      if (type === "primary") {
        setPrimaryColor(color);
      } else {
        setSecondaryColor(color);
      }
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!clientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    // Validate hex colors
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(primaryColor)) {
      toast.error("Please enter a valid primary color in hex format (e.g., #FF5733)");
      return;
    }
    if (!hexPattern.test(secondaryColor)) {
      toast.error("Please enter a valid secondary color in hex format (e.g., #33FF57)");
      return;
    }

    // Here you would typically save to backend/API
    toast.success("Client configuration saved successfully");
  };

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <Settings size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">Client configuration</span>
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
        <div className="max-w-[800px] flex flex-col gap-[40px]">
          {/* Client Name Section */}
          <Card className="bg-white border-0 rounded-[12px] shadow-none">
            <CardContent className="p-[24px]">
              <Field label="Client name">
                <StyledInput
                  variant="brief"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Logo Upload Section */}
          <Card className="bg-white border-0 rounded-[12px] shadow-none">
            <CardContent className="p-[24px]">
              <Field label="Client logo">
                <div className="flex flex-col gap-4">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <div className="w-[200px] h-[200px] border-2 border-gray-200 rounded-[12px] overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={logoPreview}
                          alt="Client logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                        aria-label="Remove logo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-[12px] flex items-center justify-center bg-gray-50">
                      <p className="text-sm text-gray-500">No logo uploaded</p>
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      onClick={handleUploadLogo}
                      className="h-[40px] bg-[#f1f1f3] hover:bg-[#e5e5e5] backdrop-blur-[6px] rounded-[28px] px-[24px]"
                    >
                      <Upload size={16} className="mr-2 text-black" />
                      <span className="text-sm font-semibold leading-[18.62px] text-black">
                        {logoPreview ? "Change logo" : "Upload logo"}
                      </span>
                    </Button>
                  </div>
                </div>
              </Field>
            </CardContent>
          </Card>

          {/* Color Palette Section */}
          <Card className="bg-white border-0 rounded-[12px] shadow-none">
            <CardContent className="p-[24px]">
              <h3 className="text-[22px] font-bold leading-[29.26px] text-black mb-6">
                Color palette
              </h3>
              <div className="flex flex-col gap-6">
                <Field label="Primary color">
                  <div className="flex gap-3 items-center">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-[60px] h-[40px] cursor-pointer rounded-[8px] border border-gray-300"
                    />
                    <StyledInput
                      variant="brief"
                      placeholder="#000000"
                      value={primaryColor}
                      onChange={(e) => handleColorChange(e.target.value, "primary")}
                      className="flex-1"
                    />
                  </div>
                </Field>
                <Field label="Secondary color">
                  <div className="flex gap-3 items-center">
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-[60px] h-[40px] cursor-pointer rounded-[8px] border border-gray-300"
                    />
                    <StyledInput
                      variant="brief"
                      placeholder="#000000"
                      value={secondaryColor}
                      onChange={(e) => handleColorChange(e.target.value, "secondary")}
                      className="flex-1"
                    />
                  </div>
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Monday Integration Section */}
          <Card className="bg-white border-0 rounded-[12px] shadow-none">
            <CardContent className="p-[24px]">
              <h3 className="text-[22px] font-bold leading-[29.26px] text-black mb-6">
                Monday.com Integration
              </h3>
              <div className="flex flex-col gap-6">
                <Field label="Monday API Token">
                  <StyledInput
                    variant="brief"
                    type="password"
                    placeholder="Enter Monday API token"
                    value={mondayApiToken}
                    onChange={(e) => setMondayApiToken(e.target.value)}
                  />
                </Field>
                <Field label="Monday Board ID">
                  <StyledInput
                    variant="brief"
                    placeholder="Enter Monday Board ID"
                    value={mondayBoardId}
                    onChange={(e) => setMondayBoardId(e.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="h-[40px] bg-yellow-500 hover:bg-yellow-600 backdrop-blur-[6px] rounded-[28px] px-[32px]"
            >
              <span className="text-sm font-semibold leading-[18.62px] text-black">
                Save configuration
              </span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

