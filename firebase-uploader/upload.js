const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
// تحميل بيانات الاتصال بـ Firebase
const serviceAccount = require("./serviceAccountKey.json");
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
// عملية الرفع
files.forEach(({ file, collection }) => {
  const filePath = path.join(__dirname, file);
  console.log(`📂 Processing file: ${file} → collection: ${collection}`);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const items = data.collection?.[collection] || data[collection];

    if (!items) {
      console.warn(
        `⚠ No data found for collection '${collection}' in file '${file}'`
      );
      return;
    }

    items.forEach(async (item) => {
      try {
        if (!item?.title) {
          console.warn(
            `⚠ Skipping item with missing title in [${collection}] from file '${file}'`
          );
          return;
        }

        await db.collection(collection).doc(item.id).set(item);
        console.log(`✅ Uploaded to [${collection}]: ${item.title}`);
      } catch (error) {
        console.error(
          `❌ Failed to upload item from [${collection}] in file '${file}':`,
          error
        );
      }
    });
  } catch (err) {
    console.error(`❌ Error reading or parsing file '${file}':`, err.message);
  }
});
