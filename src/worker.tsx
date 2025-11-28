import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { env } from "cloudflare:workers";

import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { getStreets } from "@/app/api/streets";
import { getSchedule } from "@/app/api/schedule";
import { getIcs } from "@/app/api/ics";

export type AppContext = {
  db: D1Database;
};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    ctx.db = env.DB;
  },
  route("/api/streets", getStreets),
  route("/api/schedule", getSchedule),
  route("/api/ics", getIcs),
  render(Document, [route("/", Home)]),
]);
