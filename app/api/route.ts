import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "Welcome to the FixFX API Documentation.",
    routes: [
      {
        name: "search",
        path: "/api/search?query=test",
      },
      {
        name: "natives",
        path: "/api/natives?game=gta5&environment=client",
        description: "FiveM/RedM natives documentation",
      },
      {
        name: "artifacts",
        path: "/api/artifacts?platform=windows&product=fivem",
        description: "FiveM/RedM server artifacts",
      },
      {
        name: "validator",
        path: "/api/validator/validate",
        description: "JSON validator with txAdmin embed support",
      },
    ],
  });
}
