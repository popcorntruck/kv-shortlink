import { HandlerContext, Handlers } from "$fresh/server.ts";

// Jokes courtesy of https://punsandoneliners.com/randomness/programmer-jokes/
const JOKES = [
  "Why do Java developers often wear glasses? They can't C#.",
  "A SQL query walks into a bar, goes up to two tables and says “can I join you?”",
  "Wasn't hard to crack Forrest Gump's password. 1forrest1.",
  "I love pressing the F5 key. It's refreshing.",
  "Called IT support and a chap from Australia came to fix my network connection.  I asked “Do you come from a LAN down under?”",
  "There are 10 types of people in the world. Those who understand binary and those who don't.",
  "Why are assembly programmers often wet? They work below C level.",
  "My favourite computer based band is the Black IPs.",
  "What programme do you use to predict the music tastes of former US presidential candidates? An Al Gore Rhythm.",
  "An SEO expert walked into a bar, pub, inn, tavern, hostelry, public house.",
];

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const shortId = ctx.params["shortId"];

    if (!shortId || typeof shortId !== "string") {
      return new Response("you must add id", { status: 404 });
    }

    const kv = await Deno.openKv();
    const data = await kv.get(["link", shortId]);

    if (!data.value) {
      return new Response("Invalid short link id", { status: 404 });
    }

    return new Response("", {
      status: 308,
      headers: {
        location: data.value,
      },
    });
  },
};
