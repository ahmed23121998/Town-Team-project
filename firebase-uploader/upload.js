<<<<<<< HEAD
<<<<<<< HEAD
// upload.js

=======
>>>>>>> dc011cca47e24f4a497045e87bd2abc190605313
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. init Firebase
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// 2. Read all folders in __dirname
const entries = fs.readdirSync(__dirname, { withFileTypes: true });
const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

folders.forEach((folder) => {
  const collectionName = folder; // Collection name matches folder name
  const folderPath = path.join(__dirname, folder);

  // 3. Read all JSON files inside the folder
  const jsonFiles = fs
    .readdirSync(folderPath)
    .filter(
      (f) => f.endsWith(".json") && f.toLowerCase() !== "serviceAccountKey.json"
    );

  jsonFiles.forEach((file) => {
    const subName = path.basename(file, ".json"); // File name without .json
    const filePath = path.join(folderPath, file);
    console.log(
      `📂 [${collectionName}] ↳ processing ${file} as sub="${subName}"`
    );

    let raw;

    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error(`❌ JSON parse error in ${filePath}: ${err.message}`);
      return;
    }

    // 4. Data might be under raw.collection[subName] or raw[subName]
    const root = raw.collection || raw;
    const items = root[subName];

    if (!items) {
      console.warn(`⚠ No data for key "${subName}" in ${filePath}`);
      return;
    }

    // 5. If items is an array
    if (Array.isArray(items)) {
      items.forEach(async (item) => {
        if (!item.id) return;

        try {
          await db
            .collection(collectionName)
            .doc(subName) // Folder as document
            .collection("items") // Collection under folder
            .doc(item.id)
            .set(item);

          console.log(
            `✅ uploaded ${item.id} under ${collectionName}/${subName}/items`
          );
        } catch (err) {
          console.error(`❌ Error uploading item ${item.id}: ${err.message}`);
        }
      });
    }
    // 6. If items is an object containing subcategories
    else if (typeof items === "object") {
      Object.entries(items).forEach(async ([groupName, arr]) => {
        if (!Array.isArray(arr)) return;

        for (const item of arr) {
          if (!item.id) continue;

          try {
            await db
              .collection(collectionName)
              .doc(subName) // Main folder as doc
              .collection(groupName) // Subcollection under subName
              .doc(item.id)
              .set(item);

            console.log(
              `✅ uploaded ${item.id} under ${collectionName}/${subName}/${groupName}`
            );
          } catch (err) {
            console.error(
              `❌ Error uploading item ${item.id} under group ${groupName}: ${err.message}`
            );
          }
        }
      });
    } else {
      console.warn(`⚠ Unexpected data type for "${subName}" in ${filePath}`);
    }
  });
});

<<<<<<< HEAD
});
=======
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
>>>>>>> 702eea55ccd7921ce471a085fd47947c75dcfe96
=======

// import admin from "firebase-admin";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. init Firebase
// const serviceAccount = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
// );
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
// const db = admin.firestore();

// // 2. قراءة جميع الفولدرات في __dirname
// const entries = fs.readdirSync(__dirname, { withFileTypes: true });
// const folders = entries
//   .filter((e) => e.isDirectory())
//   .map((e) => e.name);

// folders.forEach((folder) => {
//   const collectionName = folder; // اسم الكولكشن يطابق اسم الفولدر
//   const folderPath = path.join(__dirname, folder);

//   // 3. قراءة جميع ملفات JSON داخل الفولدر
//   const jsonFiles = fs
//     .readdirSync(folderPath)
//     .filter(
//       (f) =>
//         f.endsWith(".json") &&
//         f.toLowerCase() !== "serviceaccountkey.json"
//     );

//   jsonFiles.forEach((file) => {
//     const subName = path.basename(file, ".json"); // اسم الملف بدون .json
//     const filePath = path.join(folderPath, file);
//     console.log(`📂 [${collectionName}] ↳ processing ${file} as sub="${subName}"`);

//     let raw;

//     try {
//       raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
//     } catch (err) {
//       console.error(`❌ JSON parse error in ${filePath}: ${err.message}`);
//       return;
//     }

//     // 4. البيانات ممكن تكون تحت raw.collection[subName] أو raw[subName]
//     const root = raw.collection || raw;
//     const items = root[subName];

//     if (!items) {
//       console.warn(`⚠ No data for key "${subName}" in ${filePath}`);
//       return;
//     }

//     // 5. إذا كانت items مصفوفة
//     if (Array.isArray(items)) {
//       items.forEach(async (item) => {
//         if (!item.id) return;

//         try {
//           await db
//             .collection(collectionName)
//             .doc(subName) // الفولدر كـ document
//             .collection("items") // collection تحت الفولدر
//             .doc(item.id)
//             .set(item);

//           console.log(`✅ uploaded ${item.id} under ${collectionName}/${subName}/items`);
//         } catch (err) {
//           console.error(`❌ Error uploading item ${item.id}: ${err.message}`);
//         }
//       });
//     }
//     // 6. إذا كان items كائن يحتوي على تصنيفات فرعية
//     else if (typeof items === "object") {
//       Object.entries(items).forEach(async ([groupName, arr]) => {
//         if (!Array.isArray(arr)) return;

//         for (const item of arr) {
//           if (!item.id) continue;

//           try {
//             await db
//               .collection(collectionName)
//               .doc(subName) // الفولدر الأساسي كـ doc
//               .collection(groupName) // مجموعة فرعية تحت subName
//               .doc(item.id)
//               .set(item);

//             console.log(`✅ uploaded ${item.id} under ${collectionName}/${subName}/${groupName}`);
//           } catch (err) {
//             console.error(`❌ Error uploading item ${item.id} under group ${groupName}: ${err.message}`);
//           }
//         }
//       });
//     } else {
//       console.warn(`⚠ Unexpected data type for "${subName}" in ${filePath}`);
//     }
//   });
// });
>>>>>>> dc011cca47e24f4a497045e87bd2abc190605313
