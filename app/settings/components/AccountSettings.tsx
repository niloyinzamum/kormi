"use client";

import { DIVISIONS } from "@/app/assets/resources";
import { useUserInfo } from "@/app/hooks/useUserInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { api_client } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  accountSettingsFormSchema,
  AccountSettingsFormType,
  accountSettingsFormValues
} from "./form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function AccountSettings() {
  const router = useRouter();

  const t = useTranslations("AccountSettings");
  const district = useTranslations("Districts");
  const division = useTranslations("Divisions");

  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    user: currentUser,
    isLoading: userLoading,
    setIsRefetch
  } = useUserInfo();

  const form = useForm<AccountSettingsFormType>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      ...accountSettingsFormValues,
      key: "account"
    }
  });

  function onSubmit(values: AccountSettingsFormType) {
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value || null);
      } else {
        formData.append(key, value || null);
      }
    });

    api_client
      .patch(`/user/${currentUser?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        setIsRefetch(true);

        if (res.data.status === "success") {
          toast.success(res.data.message);
        }
        window.location.reload();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  const error = (field: keyof AccountSettingsFormType): string | undefined => {
    return form.formState.errors[field]?.message as string | undefined;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (currentUser) {
      const {
        name,
        address,
        district,
        division,
        email,
        profilePhoto,
        organizationContactPerson,
        organizationType,
        phone
      } = currentUser;
      const body = {
        name,
        address,
        district,
        division,
        email,
        profilePhoto,
        organizationContactPerson,
        organizationType,
        phone
      };

      Object.keys(body).forEach((key) => {
        // eslint-disable-next-line
        // @ts-ignore
        form.setValue(`${key as keyof TUser}`, body[key as keyof TUser]);
      });
    }
    // eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setDistricts(
        (DIVISIONS.find((item) => item.division === currentUser.division)
          ?.districts as []) || []
      );
    }
  }, [currentUser]);

  return (
    <div className="grid grid-cols-1">
      {userLoading && (
        <div className="flex items-center justify-center h-full">
          <Loader size={20} className="animate-spin" />
        </div>
      )}
      {!userLoading && currentUser && (
        <div className="mt-4 p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
          <h5 className="text-lg font-semibold mb-6">Personal Details</h5>
          <form className="text-left" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="font-semibold" htmlFor="name">
                  {t("name")}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("name")}
                  {...form.register("name")}
                />
                {error("name") ? (
                  <p className="text-red-500 font-semibold text-sm">
                    {error("name")}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="font-semibold" htmlFor="email">
                  {t("email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  placeholder="name@example.com"
                  {...form.register("email")}
                />
              </div>

              <div>
                <label className="font-semibold" htmlFor="userphone">
                  {t("phone_number")}
                </label>
                <Input
                  id="userphone"
                  type="text"
                  placeholder={t("phone_number_placeholder")}
                  {...form.register("phone")}
                />
                {error("phone") && (
                  <p className="text-red-500 font-semibold text-sm">
                    {error("phone")}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold" htmlFor="useraddress">
                  {t("address")}
                </label>
                <Input
                  id="useraddress"
                  type="text"
                  placeholder={t("address_placeholder")}
                  {...form.register("address")}
                />
                {error("address") && (
                  <p className="text-red-500 font-semibold text-sm">
                    {error("address")}
                  </p>
                )}
              </div>

              {currentUser?.role === "11" && (
                <>
                  <div className="mb-4 text-left">
                    <label className="font-semibold" htmlFor="division">
                      {t("division_placeholder")}
                    </label>
                    <Select
                      defaultValue={currentUser?.division}
                      onValueChange={(value) => {
                        form.setValue("division", value);
                        form.setValue("district", "");

                        setDistricts(
                          (DIVISIONS.find((item) => item.division === value)
                            ?.districts as []) || []
                        );
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder={t("division_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {DIVISIONS.map((item) => {
                            return (
                              <SelectItem key={item.id} value={item.division}>
                                {division(item.division)}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {error("division") ? (
                      <p className="text-red-500 font-semibold text-sm">
                        {error("division")}
                      </p>
                    ) : null}
                  </div>

                  {districts.length > 0 ? (
                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="division">
                        {t("district_placeholder")}
                      </label>
                      <Select
                        defaultValue={currentUser?.district}
                        onValueChange={(value) =>
                          form.setValue("district", value)
                        }
                      >
                        <SelectTrigger className="">
                          <SelectValue
                            placeholder={t("district_placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {districts.map((item, idx) => {
                              return (
                                <SelectItem key={idx} value={item}>
                                  {district(item)}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {error("district") ? (
                        <p className="text-red-500 font-semibold text-sm">
                          {error("district")}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </>
              )}

              {currentUser?.role === "10" && (
                <>
                  <div>
                    <label
                      className="font-semibold"
                      htmlFor="organizationContactPerson"
                    >
                      {t("organization_contact_person")}
                    </label>
                    <Input
                      id="organizationContactPerson"
                      type="text"
                      placeholder={t("organization_contact_person_placeholder")}
                      {...form.register("organizationContactPerson")}
                    />
                    {error("organizationContactPerson") && (
                      <p className="text-red-500 font-semibold text-sm">
                        {error("organizationContactPerson")}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <label className="font-semibold" htmlFor="companyImage">
                      {t("company_image")}
                    </label>
                    <Input
                      id="companyImage"
                      type="file"
                      placeholder={t("company_image_placeholder")}
                      onChange={handleFileChange}
                    />
                    {error("image") && (
                      <p className="text-red-500 font-semibold text-sm">
                        {error("image")}
                      </p>
                    )}
                  </div>

                  <div className="max-w-[100px] max-h[100px]">
                    {form.getValues("image") && imagePreview ? (
                      <Image
                        unoptimized
                        src={imagePreview}
                        alt="user image"
                        className="rounded-md w-auto h-auto"
                        width={100}
                        height={100}
                      />
                    ) : currentUser?.profilePhoto ? (
                      <Image
                        unoptimized
                        alt="user image"
                        src={`${currentUser?.profilePhoto}`}
                        className="rounded-md w-auto h-auto"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-3">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md"
                disabled={isLoading}
              >
                {isLoading && <Loader className="animate-spin" />}{" "}
                {t("save_changes")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
