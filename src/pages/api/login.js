// src/pages/api/login.js
export const prerender = false;

export async function POST({ request, cookies, redirect }) {
  const formData = await request.formData();
  const password = formData.get("password");

  
  if (password === import.meta.env.ADMIN_PASSWORD) {
    cookies.set("admin", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
    return new Response(null, { status: 200 });
  } else {
    return new Response("Mot de passe incorrect", {
      status: 401,
    });
  }
}
