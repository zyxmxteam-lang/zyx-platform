import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, getInitials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const storedEmail = process.env.AUTH_EMAIL ?? "";
    const storedHash = process.env.AUTH_PASSWORD_HASH ?? "";
    const storedName = process.env.AUTH_NAME ?? "Usuario";
    const storedRole = process.env.AUTH_ROLE ?? "admin";

    const emailMatch = email.toLowerCase().trim() === storedEmail.toLowerCase().trim();
    const passwordMatch = storedHash ? bcrypt.compareSync(password, storedHash) : false;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }

    await createSession({
      id: "user-1",
      email: storedEmail,
      name: storedName,
      role: storedRole,
      initials: getInitials(storedName),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
