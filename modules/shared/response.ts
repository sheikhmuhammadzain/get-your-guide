import { NextResponse } from "next/server";
import type { ProblemDetails } from "@/types/travel";

export function ok<T>(payload: T, status = 200): NextResponse<T> {
  return NextResponse.json(payload, { status });
}

export function created<T>(payload: T, location?: string): NextResponse<T> {
  const response = NextResponse.json(payload, { status: 201 });
  if (location) {
    response.headers.set("Location", location);
  }
  return response;
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function problemResponse(problem: ProblemDetails): NextResponse<ProblemDetails> {
  return NextResponse.json(problem, {
    status: problem.status,
    headers: {
      "content-type": "application/problem+json",
    },
  });
}
