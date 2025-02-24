"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { api_client } from "@/lib/axios";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface JobBanModalProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string | undefined;
  isBanned: boolean;
}

export function UserBanModal(props: JobBanModalProps) {
  const t = useTranslations("UserBanModal");
  const { open, setIsOpen, userId, isBanned } = props;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleBan = async () => {
    setIsLoading(true);
    try {
      const res = await api_client.patch(`user/${userId}/ban`);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setIsOpen(false);
        router.refresh();
      } else {
        console.error("Failed to Ban the user:", res.data.error);
        toast.error(res.data.error);
      }
    } catch (err) {
      console.error("Failed to Ban the user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle>
            {isBanned ? t("unban_confirmation") : t("ban_confirmation")}
          </DialogTitle>
          <DialogDescription>
            {isBanned ? t("unban_description") : t("ban_description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t("no")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => {
                handleBan();
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && <Loader className="animate-spin" />} {t("yes")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
