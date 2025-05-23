"use client";

import { InputPassword } from "@/app/components/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api_client } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TRegisterAs } from "../page";
import { companyFormSchema, CompanyFormType, companyFormValues } from "./forms";
import Image from "next/image";

interface CompanyRegisterFormProps {
  setRegisterAsBtn: Dispatch<SetStateAction<TRegisterAs | null>>;
}

export function CompanyRegisterForm(props: CompanyRegisterFormProps) {
  const { setRegisterAsBtn } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    form.setValue("image", null);
  };

  const form = useForm<CompanyFormType>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: companyFormValues
  });

  function onSubmit(values: CompanyFormType) {
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value || null);
      } else {
        formData.append(key, value as string);
      }
    });
    formData.append("role", "10");

    api_client
      .post("auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        router.push("/auth/login");
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে");
      })
      .catch(() => { })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const error = (field: keyof CompanyFormType): string | undefined => {
    return form.formState.errors[field]?.message as string | undefined;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  return (
    <form className="text-left" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-3">
        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="companyname">
            প্রতিষ্ঠানের নাম
          </label>
          <Input
            id="companyname"
            type="text"
            placeholder="প্রতিষ্ঠানের নাম"
            {...form.register("name")}
          />
          {error("name") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("name")}
            </p>
          ) : null}
        </div>
        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="companytype">
            প্রতিষ্ঠানের ধরন
          </label>
          <Input
            id="companytype"
            type="text"
            placeholder="প্রতিষ্ঠানের ধরন"
            {...form.register("organizationType")}
          />
          {error("organizationType") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("organizationType")}
            </p>
          ) : null}
        </div>

        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="companyphone">
            ফোন নাম্বার
          </label>
          <Input
            id="companyphone"
            type="text"
            placeholder="ফোন নাম্বার"
            {...form.register("phone")}
          />
          {error("phone") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("phone")}
            </p>
          ) : null}
        </div>

        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="organizationContactPerson">
            প্রতিষ্ঠানের যোগাযোগকারীর নাম
          </label>
          <Input
            id="organizationContactPerson"
            type="text"
            placeholder="প্রতিষ্ঠানের নাম"
            {...form.register("organizationContactPerson")}
          />
          {error("organizationContactPerson") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("organizationContactPerson")}
            </p>
          ) : null}
        </div>

        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="address">
            ঠিকানা
          </label>
          <Input
            id="address"
            type="text"
            placeholder="ঠিকানা"
            {...form.register("address")}
          />
          {error("address") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("address")}
            </p>
          ) : null}
        </div>

        <div className="mb-4 text-left">
          {preview && (
            <div className="mb-6">
              <Image unoptimized
                src={preview}
                alt="Preview"
                width={300}
                height={300}
                className="w-[300px] h-[300px] object-cover rounded border mb-2"
              />
              <button
                onClick={clearImage}
                className="px-2 py-1 bg-red-500 text-sm text-white rounded"
              >
                Remove
              </button>
            </div>
          )}

          <label className="font-semibold" htmlFor="companyImage">
            প্রতিষ্ঠানের ছবি
          </label>
          <Input
            id="companyImage"
            type="file"
            placeholder="প্রতিষ্ঠানের ছবি"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          {error("image") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("image")}
            </p>
          ) : null}
        </div>

        <div className="mb-4 text-left">
          <label className="font-semibold" htmlFor="LoginEmail">
            ইমেইল
          </label>
          <Input
            id="LoginEmail"
            type="email"
            placeholder="name@example.com"
            {...form.register("email")}
          />
          {error("email") ? (
            <p className="text-red-500 font-semibold text-sm">
              {error("email")}
            </p>
          ) : null}
        </div>
        <InputPassword
          label="পাসওয়ার্ড"
          {...form.register("password")}
          errorMessage={error("password")}
        />
        <InputPassword
          label="পাসওয়ার্ড পুনরায় দিন"
          {...form.register("confirmPassword")}
          errorMessage={error("confirmPassword")}
        />

        <div className="mb-4">
          <Button
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md w-full"
          >
            {isLoading && <Loader className="animate-spin" />} অ্যাকাউন্ট তৈরি
          </Button>
        </div>
        <div className="mb-4 text-center">
          <p className="text-sm">অথবা</p>
          <Button
            type="button"
            variant="link"
            className="text-emerald-800 underline"
            onClick={() => setRegisterAsBtn("individual")}
          >
            ব্যক্তি হিসাবে যোগদান করুন
          </Button>
        </div>

        <div className="text-center">
          <span className="text-slate-800 me-2">
            ইতিমধ্যেই রেজিস্ট্রেশন করা আছে ?{" "}
          </span>{" "}
          <Link
            className="text-black dark:text-white font-bold"
            href="/auth/login"
          >
            সাইন ইন
          </Link>
        </div>
      </div>
    </form>
  );
}
