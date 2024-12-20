import { connectToMongoDB } from "@/lib/database";
import { handleError } from "@/lib/handleErrors";
import { uploadFile, uploadFileMiddleware } from "@/lib/upload";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/user";

export async function register(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string) || null;
    const role = (formData.get("role") as string) || null;
    const division = (formData.get("division") as string) || null;
    const district = (formData.get("district") as string) || null;
    const organizationType =
      (formData.get("organizationType") as string) || null;
    const phone = (formData.get("phone") as string) || null;
    const organizationContactPerson =
      (formData.get("organizationContactPerson") as string) || null;
    const address = (formData.get("address") as string) || null;
    const email = (formData.get("email") as string) || null;
    const password = (formData.get("password") as string) || null;
    let file = (formData.get("image") as File | string | null) || null;

    if (file === "null") file = null;

    await connectToMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 400 }
      );
    }

    let image = null;

    if (file !== null) {
      // eslint-disable-next-line
      // @ts-ignore
      await uploadFileMiddleware(request, {}, uploadFile.single("image"));
      const buffer = await (file as File).arrayBuffer();
      image = `data:${(file as File).type};base64,${Buffer.from(buffer).toString("base64")}`;
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      division,
      district,
      file: image,
      organizationType,
      organizationContactPerson
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return handleError(error);
  }
}
