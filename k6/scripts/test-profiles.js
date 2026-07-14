const profiles = {
  smoke: {
    executor: "constant-vus",
    vus: 1,
    duration: "30s",
  },

  average: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 20 },
      { duration: "3m", target: 20 },
      { duration: "1m", target: 0 },
    ],
  },

  stress: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 20 },
      { duration: "2m", target: 50 },
      { duration: "2m", target: 100 },
      { duration: "1m", target: 0 },
    ],
  },

  soak: {
    executor: "constant-vus",
    vus: 20,
    duration: "30m", // 30m
  },

  breakpoint: {
    executor: "ramping-arrival-rate",
    startRate: 10,
    timeUnit: "1s",
    preAllocatedVUs: 50,
    maxVUs: 500,
    stages: [
      { duration: "1m", target: 50 },
      { duration: "1m", target: 100 },
      { duration: "1m", target: 200 },
      { duration: "1m", target: 400 },
    ],
  },

  spike: {
    executor: "ramping-vus",
    startVUs: 10,
    stages: [
      { duration: "30s", target: 10 },
      { duration: "10s", target: 200 },
      { duration: "1m", target: 200 },
      { duration: "30s", target: 10 },
    ],
  },
};

export function getTestOptions(testType) {
  const profile = profiles[testType];

  if (!profile) {
    throw new Error(`Unsupported test type: ${testType}`);
  }

  return {
    scenarios: {
      benchmark: profile,
    },
  };
}