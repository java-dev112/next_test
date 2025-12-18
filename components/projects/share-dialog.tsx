"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Mail, Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl?: string;
}

export function ShareDialog({ open, onOpenChange, shareUrl }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareWithView, setShareWithView] = useState(true);
  const [shareWithEdit, setShareWithEdit] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (shareUrl) {
      setCurrentUrl(shareUrl);
    } else if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [shareUrl]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copied to clipboard!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy link. Please copy manually.");
    }
  };

  const handleShareViaEmail = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const subject = encodeURIComponent("Shared Projects View");
    const body = encodeURIComponent(
      `I'm sharing this projects view with you:\n\n${currentUrl}\n\n${
        shareWithView ? "View access" : ""
      }${shareWithView && shareWithEdit ? " + " : ""}${
        shareWithEdit ? "Edit access" : ""
      }`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    toast.success("Email client opened");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Share Projects</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={currentUrl || ""}
                readOnly
                placeholder="Loading URL..."
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto min-w-[80px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view"
                  checked={shareWithView}
                  onCheckedChange={(checked) =>
                    setShareWithView(checked as boolean)
                  }
                />
                <Label
                  htmlFor="view"
                  className="font-normal cursor-pointer flex-1"
                >
                  View only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={shareWithEdit}
                  onCheckedChange={(checked) =>
                    setShareWithEdit(checked as boolean)
                  }
                />
                <Label
                  htmlFor="edit"
                  className="font-normal cursor-pointer flex-1"
                >
                  Can edit
                </Label>
              </div>
            </div>
          </div>

          {/* Share via Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Share via Email</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleShareViaEmail} variant="outline" size="sm" className="w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Quick Share Options */}
          <div className="pt-2 border-t">
            <Label className="text-sm text-gray-600 mb-2 block">
              Quick Share
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopyLink}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

