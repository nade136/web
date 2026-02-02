import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase service role configuration." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const userId = String(formData.get("user_id") ?? "");
    const userEmail = String(formData.get("user_email") ?? "");

    if (!userId) {
      return NextResponse.json({ error: "User id is required." }, { status: 400 });
    }

    const payload = {
      country: String(formData.get("country") ?? ""),
      firstName: String(formData.get("first_name") ?? ""),
      lastName: String(formData.get("last_name") ?? ""),
      dateOfBirth: String(formData.get("date_of_birth") ?? ""),
      idType: String(formData.get("id_type") ?? ""),
      idNumber: String(formData.get("id_number") ?? ""),
    };

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const uploadFile = async (file: File, pathPrefix: string) => {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `${pathPrefix}-${Date.now()}.${fileExt}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabase.storage
        .from("kyc-docs")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage.from("kyc-docs").getPublicUrl(filePath);
      return data.publicUrl;
    };

    const docs: Record<string, string> = {};
    const frontFile = formData.get("id_front");
    const backFile = formData.get("id_back");
    const selfieFile = formData.get("selfie");

    if (frontFile instanceof File) {
      docs.id_front = await uploadFile(frontFile, `${userId}-front`);
    }
    if (backFile instanceof File) {
      docs.id_back = await uploadFile(backFile, `${userId}-back`);
    }
    if (selfieFile instanceof File) {
      docs.selfie = await uploadFile(selfieFile, `${userId}-selfie`);
    }

    const { error } = await supabase.from("kyc_requests").insert({
      user_id: userId,
      user_email: userEmail || null,
      status: "pending",
      payload,
      documents: docs,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}
