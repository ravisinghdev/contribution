import { supabase } from "./supabase/supabaseClient";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "./email";

const JWT_SECRET = process.env.JWT_SECRET!;

// -------------------- UTILS --------------------
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function registerUser({
  email,
  password,
  metadata = {},
  defaultRoleId = 2, // student role
}: {
  email: string;
  password: string;
  metadata?: any;
  defaultRoleId?: number;
}) {
  try {
    // 1️⃣ Hash password
    const password_hash = await argon2.hash(password);

    // 2️⃣ Insert user
    const { data: user, error } = await supabase
      .from("users")
      .insert([{ email, password_hash, metadata, class: "11" }])
      .select("*")
      .single();

    if (error) throw error;

    // 3️⃣ Assign default role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: user.id, role_id: defaultRoleId }]);

    if (roleError) throw roleError;

    // Fetch roles after insert
    const { data: roleData, error: fetchRolesError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user.id);

    if (fetchRolesError) throw fetchRolesError;

    // 4️⃣ Return user and roles
    return {
      user,
      roles: roleData?.map((r) => r.role_id) || [],
      message: "Registration successful!",
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      user: null,
      roles: [],
      message: "Registration failed. Please try again.",
      error,
    };
  }
}

// -------------------- LOGIN --------------------
export async function loginUser({
  email,
  password,
  ip,
  userAgent,
}: {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
}) {
  // 1️⃣ Fetch user
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) throw new Error("Invalid credentials");
  if (user.disabled) throw new Error("Account disabled");
  if (!user.email_verified) throw new Error("Email not verified");

  // 2️⃣ Verify password
  const valid = await argon2.verify(user.password_hash, password);
  if (!valid) throw new Error("Invalid credentials");

  // 3️⃣ Fetch roles
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", user.id);

  const roleIds = roles?.map((r) => r.role_id) || [];

  // 4️⃣ Create session
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min
  const { data: session } = await supabase
    .from("user_sessions")
    .insert([
      { user_id: user.id, expires_at: expiresAt, ip, user_agent: userAgent },
    ])
    .select("*")
    .single();

  // 5️⃣ Create refresh token
  const rawRefresh = crypto.randomBytes(64).toString("hex");
  const refreshHash = hashToken(rawRefresh);
  await supabase.from("refresh_tokens").insert([
    {
      user_id: user.id,
      session_id: session.id,
      token_hash: refreshHash,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    },
  ]);

  // 6️⃣ Create JWT access token with roles
  const accessToken = jwt.sign(
    { userId: user.id, roles: roleIds },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 7️⃣ Return safe user data + session + tokens
  const safeUser = {
    id: user.id,
    email: user.email,
    metadata: user.metadata,
    email_verified: user.email_verified,
    created_at: user.created_at,
  };

  return {
    accessToken,
    refreshToken: rawRefresh,
    session,
    user: safeUser,
    roles: roleIds,
  };
}

// -------------------- REFRESH TOKEN --------------------
export async function refreshToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);

  const { data: tokenRow } = await supabase
    .from("refresh_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .single();

  if (
    !tokenRow ||
    tokenRow.revoked ||
    tokenRow.expires_at < new Date().toISOString()
  ) {
    if (tokenRow) {
      await supabase
        .from("refresh_tokens")
        .update({ revoked: true })
        .eq("user_id", tokenRow.user_id);
      await supabase
        .from("user_sessions")
        .update({ revoked: true })
        .eq("user_id", tokenRow.user_id);
    }
    throw new Error("Invalid refresh token");
  }

  // Rotate old token
  await supabase
    .from("refresh_tokens")
    .update({ rotated: true })
    .eq("id", tokenRow.id);

  const newRaw = crypto.randomBytes(64).toString("hex");
  const newHash = hashToken(newRaw);
  await supabase.from("refresh_tokens").insert([
    {
      user_id: tokenRow.user_id,
      session_id: tokenRow.session_id,
      token_hash: newHash,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  ]);

  const accessToken = jwt.sign({ userId: tokenRow.user_id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken: newRaw };
}

// -------------------- LOGOUT --------------------
export async function logout(sessionId: string) {
  await supabase
    .from("user_sessions")
    .update({ revoked: true })
    .eq("id", sessionId);
  await supabase
    .from("refresh_tokens")
    .update({ revoked: true })
    .eq("session_id", sessionId);
}

// -------------------- EMAIL VERIFICATION --------------------
export async function verifyEmailToken(token: string) {
  const tokenHash = hashToken(token);
  const { data: tokenRow } = await supabase
    .from("email_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .eq("purpose", "verify_email")
    .single();

  if (!tokenRow) throw new Error("Invalid or expired token");
  if (tokenRow.used || tokenRow.expires_at < new Date().toISOString())
    throw new Error("Token expired");

  await supabase
    .from("users")
    .update({ email_verified: true })
    .eq("id", tokenRow.user_id);
  await supabase
    .from("email_tokens")
    .update({ used: true })
    .eq("id", tokenRow.id);

  return true;
}

// -------------------- PASSWORD RESET --------------------
export async function createPasswordResetToken(email: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (!user) throw new Error("User not found");

  const token = uuidv4();
  const token_hash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await supabase.from("email_tokens").insert([
    {
      user_id: user.id,
      token_hash,
      purpose: "password_reset",
      expires_at: expiresAt,
    },
  ]);

  // Send password reset email
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your Farewell Project password",
    html: `
      <h1>Farewell Project</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
    `,
  });

  return token;
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);
  const { data: tokenRow } = await supabase
    .from("email_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .eq("purpose", "password_reset")
    .single();

  if (
    !tokenRow ||
    tokenRow.used ||
    tokenRow.expires_at < new Date().toISOString()
  )
    throw new Error("Invalid or expired token");

  const password_hash = await argon2.hash(newPassword);

  await supabase
    .from("users")
    .update({ password_hash })
    .eq("id", tokenRow.user_id);
  await supabase
    .from("email_tokens")
    .update({ used: true })
    .eq("id", tokenRow.id);

  // Revoke all refresh tokens and sessions
  await supabase
    .from("refresh_tokens")
    .update({ revoked: true })
    .eq("user_id", tokenRow.user_id);
  await supabase
    .from("user_sessions")
    .update({ revoked: true })
    .eq("user_id", tokenRow.user_id);

  return true;
}
