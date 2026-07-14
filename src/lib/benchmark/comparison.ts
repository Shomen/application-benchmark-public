export type Winner = "Monolith" | "Microservices" | "Tie";

export function lowerIsBetter(monolith: number, microservices: number): Winner {
  if (monolith < microservices) {
    return "Monolith";
  }

  if (microservices < monolith) {
    return "Microservices";
  }

  return "Tie";
}

export function higherIsBetter(monolith: number, microservices: number): Winner {
  if (monolith > microservices) {
    return "Monolith";
  }

  if (microservices > monolith) {
    return "Microservices";
  }

  return "Tie";
}