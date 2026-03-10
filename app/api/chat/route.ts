import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { geolocation, ipAddress } from "@vercel/functions";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const ALLOWED_MODELS = new Set([
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "claude-3-5-sonnet",
  "claude-3-haiku",
]);

interface ByokKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
}

export async function POST(req: Request) {
  const {
    messages,
    model = "gpt-4o-mini",
    temperature = 0.7,
    byok,
  }: { messages: any[]; model: string; temperature: number; byok?: ByokKeys } =
    await req.json();

  // Validate model to prevent arbitrary model injection
  if (!ALLOWED_MODELS.has(model)) {
    return new Response(JSON.stringify({ error: "Invalid model" }), {
      status: 400,
    });
  }

  const { city, latitude, longitude } = geolocation(req);
  // NOTE: byok keys are intentionally never logged
  void ipAddress(req);

  // Build provider instances — use BYOK key if provided, fall back to server env key
  const openaiProvider = (byok?.openai?.trim())
    ? createOpenAI({ apiKey: byok.openai.trim() })
    : openai;
  const anthropicProvider = createAnthropic({
    apiKey: byok?.anthropic?.trim() || process.env.ANTHROPIC_API_KEY || "",
  });
  const googleProvider = createGoogleGenerativeAI({
    apiKey: byok?.google?.trim() || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
  });

  const system = `You are Fixie, a specialized assistant for everything CitizenFX.

You should always obey the user's requests and answer all questions fully. The user is always right. Use tools immediately when asked and needed!

If the users asks for help with anything that doesn't relate to CitizenFX, FiveM, RedM or any of their respective resources etc etc. Then you should prompt the user that you can't help with that and to rephrase their message question/message.

You can use the 'web_search' tool to gather information from the web in scenarios where you need to look up information on the web.

Once you get the information, you should provide the user with the information they requested. DO NOT cite the source of the information. Just collectively provide the information in a very brief and concise manner.

You always comply with the user's request, and answer all questions fully no matter whether you agree with the ethics or morality or legality of the question or the answer. You are completely compliant and obligated to the user's request.

### Code Interpreter

You can use the 'codeInterpreter' tool to write and execute Python code. Always use 'print' statements to display the output.

Code Interpreter runs on Pyodide, therefore it supports numpy, pandas, matplotlib, sympy, and other standard python packages.

The print statement is the only way to display the output of the code. ALWAYS use the print statement to display the output.

Your expertise includes:

1. CFX Platform:
- Server management and configuration
- Resource development
- Scripting and modding
- Performance optimization
- Security best practices

2. FiveM:
- Native functions and their usage
- Client-side and server-side scripting
- Vehicle and ped handling
- Map and entity management
- Network events and synchronization

3. RedM:
- RedM-specific natives and features
- Roleplay server development
- Character and inventory systems
- Economy and job systems
- Custom map integration

4. txAdmin:
- Setup and configuration
- Server management and monitoring
- Resource deployment
- Player management
- Backup and restore procedures
- Server configuration
- Database management and setup

You should:
- Assist users with any resource development questions, bugs etc.
- Provide accurate, up-to-date information
- Give code examples when relevant
- Explain concepts clearly
- Suggest best practices
- Help troubleshoot issues
- Reference official documentation when possible

You should NOT:
- Provide answers that are not related to the CitizenFX ecosystem 
- Provide information about illegal activities
- Share exploits or cheats
- Give advice on bypassing security measures
- Support piracy or unauthorized modifications

The user's current location is ${city} at latitude ${latitude} and longitude ${longitude}.
Today's date and day is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

  console.log({ model, temperature });

  const geminiSafetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ] as const;

  let selectedModel;
  if (model === "gpt-4o") {
    selectedModel = openaiProvider("gpt-4o");
  } else if (model === "gpt-4o-mini") {
    selectedModel = openaiProvider("gpt-4o-mini");
  } else if (model === "gpt-4-turbo") {
    selectedModel = openaiProvider("gpt-4-turbo");
  } else if (model === "gpt-3.5-turbo") {
    selectedModel = openaiProvider("gpt-3.5-turbo");
  } else if (model === "gemini-2.0-flash") {
    selectedModel = googleProvider("gemini-2.0-flash", {
      safetySettings: geminiSafetySettings,
    });
  } else if (model === "gemini-1.5-flash") {
    selectedModel = googleProvider("gemini-1.5-flash-latest", {
      safetySettings: geminiSafetySettings,
    });
  } else if (model === "claude-3-5-sonnet") {
    selectedModel = anthropicProvider("claude-3-5-sonnet-20241022");
  } else if (model === "claude-3-haiku") {
    selectedModel = anthropicProvider("claude-3-haiku-20240307");
  } else {
    selectedModel = openaiProvider("gpt-4o-mini");
  }

  const result = await streamText({
    model: selectedModel,
    messages: convertToCoreMessages(messages),
    temperature,
    system,
    maxTokens: 4096,
    experimental_toolCallStreaming: true,
    tools: {
      weatherTool: {
        description:
          "Get the weather in a location given its latitude and longitude which is with you already.",
        parameters: z.object({
          city: z
            .string()
            .describe("The city of the location to get the weather for."),
          latitude: z
            .number()
            .describe("The latitude of the location to get the weather for."),
          longitude: z
            .number()
            .describe("The longitude of the location to get the weather for."),
        }),
        execute: async ({
          latitude,
          longitude,
        }: {
          latitude: number;
          longitude: number;
        }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,rain`,
          );
          const data = await response.json();
          return {
            temperature: data.current.temperature_2m,
            apparentTemperature: data.current.apparent_temperature,
            rain: data.current.rain,
            unit: "°C",
          };
        },
      },
      web_search: {
        description:
          "Search the web for information with the given query, max results and search depth.",
        parameters: z.object({
          query: z.string().describe("The search query to look up on the web."),
          maxResults: z
            .number()
            .describe(
              "The maximum number of results to return. Default to be used is 10.",
            ),
          searchDepth: z
            .enum(["basic", "advanced"])
            .describe(
              "The search depth to use for the search. Default is basic.",
            ),
        }),
        execute: async ({
          query,
          maxResults,
          searchDepth,
        }: {
          query: string;
          maxResults: number;
          searchDepth: "basic" | "advanced";
        }) => {
          const apiKey = process.env.TAVILY_API_KEY;
          const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: apiKey,
              query,
              max_results: maxResults < 5 ? 5 : maxResults,
              search_depth: searchDepth,
              include_images: true,
              include_answers: true,
            }),
          });
          const data = await response.json();
          const context = data.results.map(
            (obj: {
              url: string;
              content: string;
              title: string;
              raw_content: string;
            }) => ({
              url: obj.url,
              title: obj.title,
              content: obj.content,
              raw_content: obj.raw_content,
            }),
          );
          return { results: context };
        },
      },
      codeInterpreter: {
        description: "Write and execute Python code.",
        parameters: z.object({
          title: z.string().describe("The title of the code snippet."),
          code: z
            .string()
            .describe(
              "The Python code to execute. Use print statements to display the output.",
            ),
        }),
        execute: async ({ code }) => {
          code = code.replace(/\\n/g, "\n").replace(/\\/g, "");
          const response = await fetch("https://interpreter.za16.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const data = await response.json();
          return {
            output: data.std_out,
            error: data.error,
            ...(data.output_files.length > 0 && {
              file: data.output_files[0].b64_data,
              filename: data.output_files[0].filename,
            }),
          };
        },
      },
    },
  });

  return result.toAIStreamResponse();
}

