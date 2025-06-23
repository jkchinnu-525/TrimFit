"use server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { formState } from "../signin/actions";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const registerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().trim(),
  password: z.string().min(4).trim(),
});

export async function registerAction(prevState: formState, formData: FormData) {
  try {
    const validationFields = registerSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validationFields.success) {
      return {
        error: "Validation failed",
        details: validationFields.error.flatten().fieldErrors,
      };
    }

    const { firstName, lastName, email, password } = validationFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists, try a different email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    await createSession(user.id);
  } catch (error) {
    return { error: "Something went wrong", details: error };
  }
  redirect("/");
}
