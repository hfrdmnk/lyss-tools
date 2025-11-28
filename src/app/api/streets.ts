import type { AppContext } from "@/worker";

export interface Street {
  id: number;
  name: string;
  houseNumbers: string | null;
  directory: number;
  locality: string;
}

export async function getStreets({ ctx, request }: { ctx: AppContext; request: Request }) {
  const url = new URL(request.url);
  const locality = url.searchParams.get("locality");

  let query = "SELECT id, name, house_numbers as houseNumbers, directory, locality FROM streets";
  const params: string[] = [];

  if (locality) {
    query += " WHERE locality = ?";
    params.push(locality);
  }

  query += " ORDER BY name ASC";

  const result = await ctx.db.prepare(query).bind(...params).all<Street>();

  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" },
  });
}
