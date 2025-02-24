import { UserDeleteModal } from "@/app/admin/components/UserDeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatEnglishToBangalNum } from "@/utils/formatEtoBLang";
import { TUser } from "@/utils/types/user";
import {
  Phone,
  Mail,
  Briefcase,
  Edit,
  Trash,
  BanIcon,
  UserRoundCheckIcon
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { USER_ROLE } from "@/lib/constant";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserBanModal } from "@/app/admin/components/UserBanModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { lang } from "moment";

export default function UserCard({
  user,
  setUsers,
  isMobileUser
}: {
  user: TUser;
  setUsers: Dispatch<SetStateAction<TUser[]>>;
  isMobileUser?: boolean;
}) {
  const t = useTranslations("UserCard");
  const t_role = useTranslations("UserRoles");
  const language = useTranslations("language")("code");

  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [shouldRemove, setShouldRemove] = useState<boolean>(false);
  const [isBanOpen, setIsBanOpen] = useState<boolean>(false);

  useEffect(() => {
    if (shouldRemove) {
      setUsers((prevUsers) =>
        prevUsers.filter((item) => item._id !== user._id)
      );
    }
  }, [shouldRemove]);

  return (
    <>
      <UserDeleteModal
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        userId={user._id}
        setShouldRemove={setShouldRemove}
      />
      <UserBanModal
        open={isBanOpen}
        setIsOpen={setIsBanOpen}
        userId={user._id}
        isBanned={user.isBanned}
      />
      <Link
        href={isMobileUser ? "#" : `/admin/users/${user._id}/jobs`}
        key={user._id}
        className={`no-underline ${isMobileUser ? "cursor-default" : ""}`}
      >
        <Card className="hover:shadow-lg transition-shadow duration-200 border-green-100 h-full flex flex-col">
          <CardHeader className="bg-green-50 border-b border-green-100 flex flex-row items-center gap-3 space-y-0 p-3">
            <Avatar>
              <AvatarImage
                src={user.profilePhoto}
                alt="Applicant"
                className="object-cover"
              />
              <AvatarFallback className="text-3xl object-cover">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-green-800 flex items-center text-md">
              {user.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-grow flex flex-col">
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <Phone className="mr-2 text-green-600" size={12} />
              {formatEnglishToBangalNum(user.phone, language)}
            </p>
            {user.email && (
              <p className="text-sm text-gray-600 flex items-center mb-1">
                <Mail className="mr-2 text-green-600 flex-shrink-0" size={12} />
                <span className="truncate">{user.email}</span>
              </p>
            )}
            {user.role && (
              <p className="text-sm text-gray-600 flex items-center">
                <Briefcase className="mr-2 text-green-600" size={12} />
                {t_role(user.role)}
              </p>
            )}
            <div
              id="user-action"
              className="flex gap-2 mt-auto pt-4 justify-between items-end"
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              <Button
                className="rounded-md bg-emerald-600/5 hover:bg-emerald-500 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-sm font-medium"
                onClick={(event) => {
                  router.push(`/admin/users/${user._id}/settings`);
                }}
              >
                <Edit strokeWidth={1.7} size={16} />
                {t("edit")}
              </Button>
              <Button
                className="rounded-md bg-yellow-600/5 hover:bg-yellow-500 border-yellow-600/10 hover:border-yellow-600 text-yellow-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-sm font-medium"
                onClick={(event) => {
                  setShouldRemove(false);
                  setIsBanOpen(true);
                }}
              >
                {user.isBanned ? (
                  <UserRoundCheckIcon strokeWidth={1.7} size={16} />
                ) : (
                  <BanIcon strokeWidth={1.7} size={16} />
                )}
                {user.isBanned ? t("unban") : t("ban")}
              </Button>
              <Button
                className="rounded-md bg-red-600/5 hover:bg-red-500 border-red-600/10 hover:border-red-600 text-red-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-sm font-medium"
                onClick={(event) => {
                  setIsDeleteOpen(true);
                }}
              >
                <Trash strokeWidth={1.7} size={16} />
                {t("delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
