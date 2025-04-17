// upload.js

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



// 2. خليه يقرأ كل الفولدرز في __dirname

const entries = fs.readdirSync(__dirname, { withFileTypes: true });

const folders = entries

  .filter((e) => e.isDirectory())

  .map((e) => e.name);



folders.forEach((folder) => {

  const collectionName = folder; // كلها كولكشن بنفس اسم الفولدر

  const folderPath = path.join(__dirname, folder);



  // 3. يقرأ كل ملفات الـ JSON في الفولدر

  const jsonFiles = fs

    .readdirSync(folderPath)

    .filter(

      (f) =>

        f.endsWith(".json") &&

        f.toLowerCase() !== "serviceaccountkey.json"

    );



  jsonFiles.forEach((file) => {

    const subName = path.basename(file, ".json"); // اسم الملف من غير .json

    const filePath = path.join(folderPath, file);

    console.log(`📂 [${collectionName}] ↳ processing ${file} as sub="${subName}"`);



    let raw;

    try {

      raw = JSON.parse(fs.readFileSync(filePath, "utf8"));

    } catch (err) {

      console.error(`❌ JSON parse error in ${filePath}: ${err.message}`);

      return;

    }



    // 4. البيانات ممكن تكون تحت raw.collection[subName] أو raw[subName]

    const root = raw.collection || raw;

    const items = root[subName];

    if (!items) {

      console.warn(`⚠ No data for key "${subName}" in ${filePath}`);

      return;

    }



    // 5. لو items مصفوفة

    if (Array.isArray(items)) {

      items.forEach(async (item) => {

        if (!item.id) return;

        await db

          .collection(collectionName)

          .doc(subName)            // كل الفولدر كـ doc

          .collection("items")    // جوه docّ الفرعي item

          .doc(item.id)

          .set(item);

        console.log(`✅ uploaded ${item.id} under ${collectionName}/${subName}/items`);

      });

    }

    // 6. لو items كائن فيه sub‑sub categories

    else if (typeof items === "object") {

      Object.entries(items).forEach(async ([groupName, arr]) => {

        if (!Array.isArray(arr)) return;

        for (const item of arr) {

          if (!item.id) continue;

          await db

            .collection(collectionName)

            .doc(subName)           // الفولدر الأساسي كـ doc

            .collection(groupName)  // subName ثم groupName

            .doc(item.id)

            .set(item);

          console.log(`✅ uploaded ${item.id} under ${collectionName}/${subName}/${groupName}`);

        }

      });

    } else {

      console.warn(`⚠ Unexpected data type for "${subName}" in ${filePath}`);

    }

  });

});