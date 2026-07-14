/* global __ENV */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend } from "k6/metrics";
import { getTestOptions } from "./test-profiles.js";

const testType = __ENV.TEST_TYPE;
const target = __ENV.TARGET;
const customerLimit = Number(__ENV.CUSTOMER_LIMIT);

if (!testType) {
  throw new Error("TEST_TYPE is required");
}

if (!target) {
  throw new Error("TARGET is required");
}

if (!customerLimit) {
  throw new Error("CUSTOMER_LIMIT is required");
}

const accountLimit = customerLimit * 10;

const monolithUrl = __ENV.MONOLITH_URL || "http://127.0.0.1:8000";
const customerServiceUrl = __ENV.CUSTOMER_SERVICE_URL || "http://127.0.0.1:8100";
const accountServiceUrl = __ENV.ACCOUNT_SERVICE_URL || "http://127.0.0.1:8200";

export const options = getTestOptions(testType);

const customerDetailsDuration = new Trend("endpoint_customer_details_duration");
const accountDetailsDuration = new Trend("endpoint_account_details_duration");

function randomId(max) {
  return Math.floor(Math.random() * max) + 1;
}

function getBaseUrls() {
  if (target === "microservices") {
    return {
      customer: customerServiceUrl,
      account: accountServiceUrl,
    };
  }

  return {
    customer: monolithUrl,
    account: monolithUrl,
  };
}

export default function benchmarkScenario() {
  const urls = getBaseUrls();

  const customerId = randomId(customerLimit);
  const accountId = randomId(accountLimit);

  group("GET /api/customers/{id}", () => {
    const response = http.get(`${urls.customer}/api/customers/${customerId}`, {
      tags: {
        endpoint: "GET /api/customers/{id}",
        target,
      },
      timeout: "30s",
    });

    customerDetailsDuration.add(response.timings.duration);

    check(response, {
      "customer details status is 200": (res) => res.status === 200,
    });
  });

  group("GET /api/accounts/{id}", () => {
    const response = http.get(`${urls.account}/api/accounts/${accountId}`, {
      tags: {
        endpoint: "GET /api/accounts/{id}",
        target,
      },
      timeout: "30s",
    });

    accountDetailsDuration.add(response.timings.duration);

    check(response, {
      "account details status is 200": (res) => res.status === 200,
    });
  });

  sleep(1);
}