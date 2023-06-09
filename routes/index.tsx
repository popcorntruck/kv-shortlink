import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

function validURL(input: string) {
  try {
    new URL(input);
    return true;
  } catch (error) {
    return false;
  }
}

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
  },
  async POST(req, ctx) {
    const data = await req.formData();
    const link = data.get("link");

    if (!link || typeof link !== "string" || !validURL(link)) {
      return await ctx.render({
        ok: false,
        errMsg: "Invalid URL - make sure to include protocol",
      });
    }

    const kv = await Deno.openKv();
    const shortId = nanoid(12);

    await kv.set(["link", shortId], link);

    return await ctx.render({
      ok: true,
      shortUrl: `${
        Deno.env.get("BASE_URL") || "http://localhost:8000"
      }/l/${shortId}`,
    });
  },
};

export default function Home(props: {
  data:
    | { ok: true; shortUrl: string }
    | { ok: false; errMsg: string }
    | undefined;
}) {
  return (
    <>
      <Head>
        <title>Link shortenr</title>
      </Head>
      <main class="flex h-screen w-screen bg-blue-50">
        <div class="m-auto flex flex-col items-center" x-data>
          <h1 class="text-3xl font-semibold">worlds best link shortner</h1>

          <form method="POST" class="flex items-center gap-2 p-4">
            <input
              type="text"
              name="link"
              class="bg-gray-200 border border-gray-400 px-6 py-2 rounded-md"
              placeholder="https://google.com"
            />
            <button class="bg-gray-200 border border-gray-400 px-6 py-2 rounded-md">
              Create
            </button>
          </form>

          {props.data && (
            <>
              {props.data.ok
                ? (
                  <span>
                    Short link created:{" "}
                    <a
                      href={props.data.shortUrl}
                      class="hover:underline text-blue-500"
                    >
                      {props.data.shortUrl}
                    </a>
                  </span>
                )
                : <p class="text-red-400">{props.data.errMsg}</p>}
            </>
          )}
        </div>
      </main>
    </>
  );
}
