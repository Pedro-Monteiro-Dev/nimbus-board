import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
    const res = NextResponse.next();
    const country = request.geo?.country ?? ""
    return res;
}