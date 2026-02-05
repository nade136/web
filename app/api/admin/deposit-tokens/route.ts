import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("web3_admin_auth");
    if (!adminCookie?.value) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase service role configuration." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("deposit_tokens")
      .select("id,name,symbol,price,networks,addresses,is_active,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ tokens: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("web3_admin_auth");
    if (!adminCookie?.value) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { name, symbol, price, networks, addresses, is_active, sort_order } = body || {};

    if (!name || !symbol) {
      return NextResponse.json({ error: "Name and symbol are required." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase service role configuration." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("deposit_tokens").insert({
      name: String(name).trim(),
      symbol: String(symbol).trim().toUpperCase(),
      price: (price ?? "$0.00").toString(),
      networks: Array.isArray(networks) ? networks : [],
      addresses: addresses && typeof addresses === "object" ? addresses : {},
      is_active: Boolean(is_active ?? true),
      sort_order: Number(sort_order ?? 0),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}
