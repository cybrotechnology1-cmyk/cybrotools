const fs = require("fs");
const path = require("path");

const STORE_FILE = path.join(__dirname, "../data/admin_store.json");

try {
  const raw = fs.readFileSync(STORE_FILE, "utf8");
  const store = JSON.parse(raw);
  let posts = store.posts || [];

  console.log(`Original posts count: ${posts.length}`);

  // Let's filter to make sure we keep only the most robust 50 articles.
  // Let's find any duplicates and keep only unique ones.
  const seenSlugs = new Set();
  const uniquePosts = [];

  posts.forEach((p) => {
    if (!p.slug) return;
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      uniquePosts.push(p);
    }
  });

  console.log(`Unique posts count: ${uniquePosts.length}`);

  // If unique posts count is less than 50, let's fill or verify
  // Let's ensure there are exactly 50 total unique high-quality articles in the store
  store.posts = uniquePosts.slice(0, 50);
  
  // Save cleaned file
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
  console.log(`Cleaned store file. Total unique posts now: ${store.posts.length}`);

} catch (err) {
  console.error("Error cleaning:", err);
}
