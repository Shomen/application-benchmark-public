# Application Benchmark

This project compares the performance of a monolithic application and a microservices-based application under different test conditions.

## Live Demo

https://benchmark.memyweb.com

## What it does

The benchmark runs different types of performance tests against the deployed applications.

The tests are executed with Grafana k6 and include:

- Smoke testing
- Load testing
- Stress testing
- Spike testing
- Soak testing
- Scalability testing

The application collects and presents metrics such as:

- Average response time
- Minimum and maximum response time
- Requests per second
- Success and failure counts
- Error rate
- Number of virtual users
- Overall execution time
- Percentile response times such as p90 and p95

The results are shown through a web interface so that the behaviour of the monolith and microservices can be compared more easily.

## Technology

- React
- Next.js
- TypeScript
- Node.js
- D3.js
- Grafana k6
- Docker
- Docker Compose
- GitHub Actions
- Nginx Proxy Manager

## Purpose

This project is part of my Master's thesis work on software architecture migration and performance evaluation.

The main purpose is to run the same benchmark scenarios against both architectures and compare how they behave under increasing traffic and different workloads.

The project is also published as a demonstration of the benchmark implementation and deployment process.

## License

This repository is shared for demonstration and evaluation purposes.