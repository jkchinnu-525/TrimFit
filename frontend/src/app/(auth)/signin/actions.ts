"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(4).trim(),
});

export type formState = {
  error?: string;
  message?: string;
} | null;
export async function loginAction(prevState: formState, formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validationFields = loginSchema.safeParse(rawData);
  if (!validationFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email, password } = validationFields.data;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid Password" };
    }
    await createSession(user.id);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong", details: error };
  }
  redirect("/");
}
