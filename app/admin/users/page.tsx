"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Loader } from "lucide-react";
import { api_client } from "@/lib/axios";
import { TUser } from "@/utils/types/user";
import { SidebarNav } from "../components/sidebar-nav";
import Header from "@/app/components/header";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { UserDeleteModal } from "@/app/admin/components/UserDeleteModal";
import UserCard from "./UserCard";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

function UserList() {
  const t = useTranslations("Users");
  const router = useRouter();
  const params = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchByType, setSearchByType] = useState("Name");
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeName, setTypeName] = useState<string>(t("all"));

  useEffect(() => {
    const type = params.get("type");
    if (type === "individual") {
      setTypeName(t("individual"));
    } else if (type === "institution") {
      setTypeName(t("institution"));
    } else if (type === "mobile") {
      setTypeName(t("mobile"));
    }
  }, [params, t]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setUsers([]);
      const query =
        `searchBy${searchByType}=${searchTerm}&` +
        (params.get("type") ? `type=${params.get("type")}` : "");
      try {
        const resp = await api_client.get(`user?${query}`);
        setUsers(resp.data.data.users);
      } catch (e) {
        toast.error(t("load_error"));
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, params, searchByType, t]);

  return (
    <>
      <Header isAdminRoute={true} />
      <div className="max-w-6xl mx-auto grid flex-1 gap-12 pt-[100px] md:grid-cols-[150px_1fr] ">
        <aside className="hidden flex-col md:flex">
          <SidebarNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-800 flex items-center">
              <User className="mr-2" size={32} />
              {t("user_list")} ({typeName})
            </h1>
            <div className="flex mb-8 relative gap-2">
              <Select
                onValueChange={(value) => setSearchByType(value)}
                defaultValue="Name"
              >
                <SelectTrigger className="w-32 border-green-200 focus:border-green-500 focus:ring-0 text-gray-600 text-center">
                  <SelectValue
                    placeholder={t("search_type")}
                    className="w-full"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Name" className="hover:bg-green-100">
                    {t("name")}
                  </SelectItem>
                  <SelectItem value="Email" className="hover:bg-green-100">
                    {t("email")}
                  </SelectItem>
                  <SelectItem value="Phone" className="hover:bg-green-100">
                    {t("phone")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              <Search
                className="absolute left-[132px] top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  user={user}
                  setUsers={setUsers}
                  key={user._id}
                  isMobileUser={params.get("type") === "mobile"}
                />
              ))}
            </div>
            {users.length === 0 && !isLoading && (
              <p className="text-center mt-8 text-gray-600">
                {t("no_results")}
              </p>
            )}
            {isLoading && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Loader size={22} className="animate-spin" />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function Users() {
  return (
    <Suspense>
      <UserList />
    </Suspense>
  );
}
