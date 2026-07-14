import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const customers = JSON.parse(
  await fs.readFile(path.join(root, "k6/data/customers_10000.json"), "utf8")
);

const accounts = JSON.parse(
  await fs.readFile(path.join(root, "k6/data/accounts_100000.json"), "utf8")
);

const progressFile = path.join(root, ".seed-progress.json");

const urls = {
  monolith: process.env.MONOLITH_BASE_URL ?? "http://127.0.0.1:8000",
  customerService: process.env.CUSTOMER_SERVICE_URL ?? "http://127.0.0.1:8100",
  accountService: process.env.ACCOUNT_SERVICE_URL ?? "http://127.0.0.1:8200",
};

const batchSize = Number(process.env.SEED_BATCH_SIZE ?? 50);

const defaultProgress = {
  monolithCustomers: [],
  microserviceCustomers: [],
  monolithAccounts: [],
  microserviceAccounts: [],
};

async function loadProgress() {
  try {
    return JSON.parse(await fs.readFile(progressFile, "utf8"));
  } catch {
    return defaultProgress;
  }
}

async function saveProgress(progress) {
  await fs.writeFile(progressFile, JSON.stringify(progress, null, 2));
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${url}: ${text}`);
  }
}

async function seedCollection({ name, items, completed, url }) {
  const done = new Set(completed);

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = [];

    for (
      let batchIndex = index;
      batchIndex < Math.min(index + batchSize, items.length);
      batchIndex += 1
    ) {
      const rowNumber = batchIndex + 1;

      if (done.has(rowNumber)) {
        continue;
      }

      batch.push({
        rowNumber,
        item: items[batchIndex],
      });
    }

    if (batch.length === 0) {
      continue;
    }

    const results = await Promise.allSettled(
      batch.map(async ({ rowNumber, item }) => {
        await postJson(url, item);
        return rowNumber;
      })
    );

    const successfulRows = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    for (const rowNumber of successfulRows) {
      completed.push(rowNumber);
      done.add(rowNumber);
    }

    await saveProgress(progress);

    const failedResult = results.find((result) => result.status === "rejected");

    if (failedResult) {
      throw failedResult.reason;
    }

    const latestRow = Math.max(...successfulRows);

    console.log(`${name}: ${latestRow}/${items.length}`);
  }

  await saveProgress(progress);
  console.log(`${name}: complete`);
}

const progress = await loadProgress();

await seedCollection({
  name: "Monolith customers",
  items: customers,
  completed: progress.monolithCustomers,
  url: `${urls.monolith}/api/customers`,
});

await seedCollection({
  name: "Microservice customers",
  items: customers,
  completed: progress.microserviceCustomers,
  url: `${urls.customerService}/api/customers`,
});

await seedCollection({
  name: "Monolith accounts",
  items: accounts,
  completed: progress.monolithAccounts,
  url: `${urls.monolith}/api/accounts`,
});

await seedCollection({
  name: "Microservice accounts",
  items: accounts,
  completed: progress.microserviceAccounts,
  url: `${urls.accountService}/api/accounts`,
});

console.log("Seed data completed.");