import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes, autoProcessRssFeeds } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { securityHeaders, corsMiddleware, sanitizeInput } from "./security";

const app = express();

// Disable X-Powered-By header globally
app.disable('x-powered-by');

// Apply security headers and CORS to all requests
app.use(securityHeaders);
app.use(corsMiddleware);

// Enable gzip/deflate compression for all responses
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Always compress HTML, CSS, JS, JSON, SVG
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Security: Limit request body size to prevent DoS attacks
app.use(
  express.json({
    limit: '10mb',  // Maximum JSON body size
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({
  extended: false,
  limit: '10mb',  // Maximum URL-encoded body size
}));

// Sanitize incoming request data (remove null bytes, control chars)
app.use(sanitizeInput);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Global error handler middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Log the error
    log(`Error: ${err.message || 'Unknown error'} - ${req.method} ${req.path}`, 'error');
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }

    // Handle Zod validation errors
    if (err.name === 'ZodError' && err.errors) {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map((e: any) => ({
          field: e.path?.join('.') || 'unknown',
          message: e.message
        }))
      });
    }

    // Handle known operational errors
    if (err.isOperational) {
      return res.status(err.statusCode || err.status || 400).json({
        error: err.message
      });
    }

    // Get appropriate status code
    const status = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

    res.status(status).json({ error: message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);

  // Security: Set server timeouts to prevent slow loris attacks
  httpServer.timeout = 120000;        // 2 minutes for complete request
  httpServer.keepAliveTimeout = 65000; // Keep alive timeout
  httpServer.headersTimeout = 66000;   // Headers timeout (must be > keepAliveTimeout)

  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
      
      // Start automatic RSS processing background loop (every 30 minutes)
      const RSS_AUTO_PROCESS_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
      
      log("[RSS Auto-Process] Starting background loop (runs every 30 minutes)", "rss");
      
      // Run immediately on startup (after 5 seconds to let everything initialize)
      setTimeout(async () => {
        try {
          log("[RSS Auto-Process] Running initial auto-process...", "rss");
          const result = await autoProcessRssFeeds();
          log(`[RSS Auto-Process] Initial run complete - Feeds: ${result.feedsProcessed}, Items: ${result.itemsFound}, Articles: ${result.articlesGenerated}`, "rss");
        } catch (error) {
          log(`[RSS Auto-Process] Initial run failed: ${error}`, "rss");
        }
      }, 5000);
      
      // Then run every 30 minutes
      setInterval(async () => {
        try {
          log("[RSS Auto-Process] Running scheduled auto-process...", "rss");
          const result = await autoProcessRssFeeds();
          log(`[RSS Auto-Process] Scheduled run complete - Feeds: ${result.feedsProcessed}, Items: ${result.itemsFound}, Articles: ${result.articlesGenerated}`, "rss");
        } catch (error) {
          log(`[RSS Auto-Process] Scheduled run failed: ${error}`, "rss");
        }
      }, RSS_AUTO_PROCESS_INTERVAL_MS);
    },
  );

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    log(`${signal} received. Starting graceful shutdown...`, "server");

    // Stop accepting new connections
    httpServer.close(() => {
      log("HTTP server closed", "server");
    });

    // Give existing requests 10 seconds to complete
    setTimeout(() => {
      log("Forcing shutdown after timeout", "server");
      process.exit(0);
    }, 10000);

    try {
      // Close database pool
      const { pool } = await import("./db");
      await pool.end();
      log("Database pool closed", "server");
    } catch (error) {
      log(`Error closing database pool: ${error}`, "server");
    }

    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})();
