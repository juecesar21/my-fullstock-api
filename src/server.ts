import env from "./env.js";
import app from "./app.js";
import { testConnection, closePool } from "./db/index.js";

function shutdown(signal: string) {
  console.log(`\nReceived ${signal}. Closing HTTP server...`);
  server.close(() => {
    console.log("HTTP server closed");
    void closePool()
      .catch((e) => {
        console.error("Error closing DB pool", e);
      })
      .finally(() => {
        process.exit(0);
      });
  });
}

async function start() {
  try {
    await testConnection();
  } catch {
    console.error(
      "Could not connect to the database. Aborting server startup."
    );
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return server;
}

const server = await start();

export default server;
