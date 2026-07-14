/**
 * configuration for the environment variables used in the application
 * **/
type EnvironmentVariable =
  | "MONOLITH_BASE_URL"
  | "CUSTOMER_SERVICE_URL"
  | "ACCOUNT_SERVICE_URL";

function requireEnvironmentVariable(name: EnvironmentVariable): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.replace(/\/+$/, "");
}

export const environment = Object.freeze({
  monolithBaseUrl: requireEnvironmentVariable("MONOLITH_BASE_URL"),
  customerServiceUrl: requireEnvironmentVariable("CUSTOMER_SERVICE_URL"),
  accountServiceUrl: requireEnvironmentVariable("ACCOUNT_SERVICE_URL"),
});