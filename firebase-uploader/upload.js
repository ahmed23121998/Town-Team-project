import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helpers for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase credentials
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const files = [
  { file: "kids.json", collection: "kids" },
  { file: "men.json", collection: "men" },
  { file: "newarrival.json", collection: "newarrival" },
  { file: "summer.json", collection: "summer" },
  { file: "winter.json", collection: "winter" },
  { file: "shoes.json", collection: "shoes" },
  { file: "accessories.json", collection: "accessories" },
  { file: "trousers.json", collection: "trousers" },
];

files.forEach(({ file, collection }) => {
  const filePath = path.join(__dirname, file);
  console.log(`📂 Processing file: ${file} → collection: ${collection}`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);
    const items = data.collection?.[collection] || data[collection];

    if (!items) {
      console.warn(
        `⚠ No data found for collection '${collection}' in file '${file}'`
      );
      return;
    }

    // الحالة 1: لو items عبارة عن Array (قديمة)
    if (Array.isArray(items)) {
      items.forEach(async (item) => {
        if (!item?.title) return;

        await db.collection(collection).doc(item.id).set(item);
        console.log(`✅ Uploaded to [${collection}]: ${item.title}`);
      });
    }

    // الحالة 2: لو items عبارة عن Object فيه sub-categories
    else if (typeof items === "object") {
      Object.entries(items).forEach(async ([subCategory, products]) => {
        if (!Array.isArray(products)) {
          console.warn(
            `⚠ Skipping invalid sub-category [${subCategory}] in [${collection}]`
          );
          return;
        }

        for (const item of products) {
          if (!item?.title) continue;

          await db
            .collection(collection)
            .doc(subCategory)
            .collection("items")
            .doc(item.id)
            .set(item);

          console.log(
            `✅ Uploaded to [${collection}/${subCategory}]: ${item.title}`
          );
        }
      });
    } else {
      console.warn(`⚠ Data format not recognized in file '${file}'`);
    }
  } catch (err) {
    console.error(`❌ Error reading or parsing file '${file}':`, err.message);
  }
});
