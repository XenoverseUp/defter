import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const defaultResponse = intlMiddleware(request);
  const { pathname } = request.nextUrl;

  const localeMatch = pathname.match(/^\/(en|tr)(\/|$)/);
  let locale = localeMatch?.[1];

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  if (!locale) {
    if (cookieLocale && routing.locales.includes(cookieLocale as "en" | "tr")) {
      locale = cookieLocale;
    } else {
      const acceptLang = request.headers.get("accept-language") || "";
      locale = detectLocaleFromHeader(acceptLang, routing.locales as unknown as string[], routing.defaultLocale);
    }

    const redirectURL = new URL(`/${locale}${pathname}`, request.url);
    const response = NextResponse.redirect(redirectURL);

    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

    return response;
  }

  if (locale !== cookieLocale) {
    defaultResponse.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const session = getSessionCookie(request);

  let response = defaultResponse;

  if (!session && pathWithoutLocale.startsWith("/dashboard")) {
    response = NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  if (session && (pathWithoutLocale === "/" || pathWithoutLocale === "/sign-up")) {
    response = NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  defaultResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

function detectLocaleFromHeader(header: string, supportedLocales: string[], defaultLocale: string) {
  const accepted = header
    .split(",")
    .map((part) => part.split(";")[0].trim())
    .filter(Boolean);

  for (const lang of accepted) {
    const baseLang = lang.split("-")[0];
    if (supportedLocales.includes(lang)) return lang;
    if (supportedLocales.includes(baseLang)) return baseLang;
  }

  return defaultLocale;
}
