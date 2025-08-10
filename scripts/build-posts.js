#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
const DATA_DIR = path.join(__dirname, "..", "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate version tag (timestamp-based)
function generateVersionTag() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `v${year}${month}${day}-${hour}${minute}${second}`;
}

// Make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    const req = client.request(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Process posts to fix escaped content from database
function processStaticPosts(posts) {
  return posts.map((post) => {
    if (!post || !post.cells) return post;

    return {
      ...post,
      cells: post.cells.map((cell) => {
        if (cell.type === "markdown" && typeof cell.content === "string") {
          let content = cell.content;

          // Remove outer quotes if they exist (double JSON encoding issue)
          if (content.startsWith('"') && content.endsWith('"')) {
            content = content.slice(1, -1);
          }

          // Convert escaped characters back to actual characters
          content = content
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"');

          return {
            ...cell,
            content,
          };
        }
        return cell;
      }),
    };
  });
}

// Fetch posts from API
async function fetchPostsFromAPI() {
  try {
    console.log("🔍 Fetching posts from API...");
    console.log(`🌐 API URL: ${API_BASE_URL}/dev/posts`);
    const url = `${API_BASE_URL}/dev/posts`;

    const response = await makeRequest(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(
        `API request failed with status ${response.statusCode}. Is the API server running?`
      );
    }

    if (!response.data.success) {
      throw new Error(`API error: ${response.data.error || "Unknown error"}`);
    }

    const posts = response.data.data || [];
    console.log(`✅ Successfully fetched ${posts.length} posts from API`);

    // Process posts to fix escaped content
    const processedPosts = processStaticPosts(posts);
    console.log(
      `🔧 Processed ${processedPosts.length} posts to fix escaped content`
    );

    return processedPosts;
  } catch (error) {
    console.error("❌ Error fetching posts from API:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.error("");
      console.error("💡 API server appears to be down. Please start it with:");
      console.error("   npm run dev:api");
      console.error("   or");
      console.error(
        '   cd functions/aws && export $(cat .env | grep -v "^#" | xargs) && npm run dev'
      );
      console.error("");
    }

    throw error;
  }
}

// Generate TypeScript file content
function generatePostsFileContent(posts, versionTag) {
  const timestamp = new Date().toISOString();

  return `// Auto-generated posts file
// Version: ${versionTag}
// Generated: ${timestamp}
// Source: API (${API_BASE_URL}/dev/posts)

import { Post } from "@/types/post";

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};

export const postsMetadata = {
  version: "${versionTag}",
  generatedAt: "${timestamp}",
  source: "api",
  count: ${posts.length}
};
`;
}

// Backup existing posts.ts file
function backupExistingPosts(versionTag) {
  const postsFile = path.join(DATA_DIR, "posts.ts");

  if (fs.existsSync(postsFile)) {
    const backupFile = path.join(BACKUP_DIR, `${versionTag}.posts.ts`);
    fs.copyFileSync(postsFile, backupFile);
    console.log(`📦 Backed up existing posts.ts to ${backupFile}`);
    return true;
  }

  return false;
}

// Write versioned posts file
function writeVersionedPosts(posts, versionTag) {
  // Create main posts.ts file
  const postsFile = path.join(DATA_DIR, "posts.ts");
  const content = generatePostsFileContent(posts, versionTag);
  fs.writeFileSync(postsFile, content, "utf8");

  // Create versioned backup
  const versionedFile = path.join(BACKUP_DIR, `${versionTag}.posts.ts`);
  fs.writeFileSync(versionedFile, content, "utf8");

  console.log(`📝 Generated posts.ts with version ${versionTag}`);
  console.log(`📝 Created versioned backup: ${versionedFile}`);
}

// Create build manifest
function createBuildManifest(versionTag, posts) {
  const manifest = {
    version: versionTag,
    timestamp: new Date().toISOString(),
    postsCount: posts.length,
    buildType: "api-sync",
    apiEndpoint: `${API_BASE_URL}/dev/posts`,
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      type: post.type,
      status: post.status,
      featured: post.featured,
      updatedAt: post.updatedAt,
    })),
  };

  const manifestFile = path.join(DATA_DIR, "build-manifest.json");
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");

  const versionedManifest = path.join(
    BACKUP_DIR,
    `${versionTag}.build-manifest.json`
  );
  fs.writeFileSync(
    versionedManifest,
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log(`📋 Created build manifest: ${manifestFile}`);
}

// Clean old backups (keep last 10 versions)
function cleanOldBackups() {
  try {
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.endsWith(".posts.ts"))
      .map((file) => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        stat: fs.statSync(path.join(BACKUP_DIR, file)),
      }))
      .sort((a, b) => b.stat.mtime - a.stat.mtime);

    // Keep only the 10 most recent backups
    const filesToDelete = files.slice(10);

    filesToDelete.forEach((file) => {
      fs.unlinkSync(file.path);
      // Also delete corresponding manifest if it exists
      const manifestFile = file.path.replace(
        ".posts.ts",
        ".build-manifest.json"
      );
      if (fs.existsSync(manifestFile)) {
        fs.unlinkSync(manifestFile);
      }
    });

    if (filesToDelete.length > 0) {
      console.log(`🧹 Cleaned ${filesToDelete.length} old backup files`);
    }
  } catch (error) {
    console.warn("⚠️  Warning: Could not clean old backups:", error.message);
  }
}

// Main build function
async function buildPosts() {
  try {
    console.log("🚀 Starting posts build process...");

    const versionTag = generateVersionTag();
    console.log(`🏷️  Build version: ${versionTag}`);

    // Backup existing posts.ts
    backupExistingPosts(versionTag);

    // Fetch posts from API
    const posts = await fetchPostsFromAPI();

    // Write new posts file with version
    writeVersionedPosts(posts, versionTag);

    // Create build manifest
    createBuildManifest(versionTag, posts);

    // Clean old backups
    cleanOldBackups();

    console.log("✅ Posts build completed successfully!");
    console.log(
      `📊 Generated ${posts.length} posts with version ${versionTag}`
    );

    return {
      success: true,
      version: versionTag,
      postsCount: posts.length,
    };
  } catch (error) {
    console.error("❌ Posts build failed:", error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  buildPosts();
}

module.exports = { buildPosts, generateVersionTag };
