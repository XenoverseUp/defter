"use server";

import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

const t = await getTranslations("validation");

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: t("logged-in"),
    };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || t("unknown-error") };
  }
};

export const signUp = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return {
      success: true,
      message: t("signed-up"),
    };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || t("unknown-error") };
  }
};
