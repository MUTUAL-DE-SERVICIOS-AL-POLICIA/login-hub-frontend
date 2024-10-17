import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const middleware = (req: NextRequest) => {
  const response = NextResponse.next()
  const cookieStore = cookies();
  const cookie = cookieStore.get("Set-Cookie");
  const token = cookie?.value;
  // console.log(`token middleware 🔐: ${token}`, req.nextUrl.pathname)

  response.headers.set("Access-Control-Allow-Origin", "http://192.168.2.201:3001")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  try {
    if (req.nextUrl.pathname == "/") {
      if (token) {
        const url = req.nextUrl.clone();
        url.pathname = "/apphub";
        return NextResponse.redirect(url);
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
    if (req.nextUrl.pathname == "/login") {
      if (token) {
        const url = req.nextUrl.clone();
        url.pathname = "/apphub";
        return NextResponse.redirect(url);
      } else {
        return response
      }
    }

    if (req.nextUrl.pathname.startsWith("/apphub")) {
      if (token) {
        return response
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  } catch (e) {
    console.log("Error verificando token en middleware");
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};
