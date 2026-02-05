import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    const initialCookies = await cookies();
    const adminCookie = initialCookies.get("web3_admin_auth");
    const adminHeader = request.headers.get("x-admin-auth");
    if (!adminCookie?.value && adminHeader !== "1") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const origin = request.headers.get("origin") || `http://${request.headers.get("host") ?? "localhost:3000"}`;

    // 1) Generate a magic link to obtain a token hash
    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${origin}/auth/callback?redirect=/dashboard/overview` },
    });
    if (linkError || !linkData?.properties?.hashed_token) {
      return NextResponse.json({ error: linkError?.message || "Failed to generate link." }, { status: 400 });
    }

    // 2) Exchange the token hash for a session server-side
    const serverClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const { data: verifyData, error: verifyError } = await serverClient.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token as string,
      type: "magiclink",
    });
    if (verifyError || !verifyData?.session) {
      return NextResponse.json({ error: verifyError?.message || "Failed to verify OTP." }, { status: 400 });
    }

    const access_token = verifyData.session.access_token;
    const refresh_token = verifyData.session.refresh_token;

    // 3) Prepare redirect response and attach Supabase auth cookies to it
    const res = NextResponse.redirect(`${origin}/dashboard/overview`, { status: 302 });

    const reqCookies = await cookies();
    const ssr = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string): string | undefined {
          return reqCookies.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; expires?: Date; httpOnly?: boolean; secure?: boolean; sameSite?: true | false | "lax" | "strict" | "none"; }) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    });

    await ssr.auth.setSession({ access_token, refresh_token });

    return res;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error." }, { status: 500 });
  }
}
