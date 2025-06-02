# Project Backend - NestJS

<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

**Project Backend** is a server-side application built with [NestJS](https://nestjs.com/), a progressive Node.js framework for creating efficient and scalable APIs. This project serves as a TypeScript starter repository, providing a foundation for building robust backend services.

## Quick Links

- [🌐 NestJS Documentation](https://docs.nestjs.com/)

## Installation

### Prerequisites

Ensure the following are installed:

- **Node.js**: v22.14.0
- **npm** or **yarn**: Package manager for dependency installation
- **Environment**: A `.env` file with required configurations (see below)

### Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/project-backend.git
   cd project-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

   > Note: If using npm and encountering peer dependency errors, try `npm install --legacy-peer-deps`.

3. **Configure Environment Variables**:

   Copy the example environment file and update it with your configuration:

   ```bash
   cp .env.example .env
   ```

   For a standard development setup, you can retain the default values for `HOST`, `BASE_PATH`, and `PORT` in the `API REST` section of the `.env` file. Update other variables (e.g., database credentials) as needed.

4. **Run the Application**:

   ```bash
   # Development mode
   npm run start
   # or
   yarn start

   # Watch mode (auto-restart on changes)
   npm run start:dev
   # or
   yarn start:dev

   # Production mode
   npm run start:prod
   # or
   yarn start:prod
   ```

   The app will run on the configured `HOST` and `PORT` (default: `http://localhost:3000`).

## Testing

Run tests to verify functionality:

```bash
# Unit tests
npm run test
# or
yarn test

# End-to-end tests
npm run test:e2e
# or
yarn test:e2e

# Test coverage
npm run test:cov
# or
yarn test:cov
```

## Linting

Maintain code quality with ESLint:

```bash
# Lint and fix issues
npm run lint
# or
yarn lint
```

## Project Structure

The project follows a modular structure for scalability:

```bash
src
├── common
│   ├── interfaces        # Shared interfaces and types
│   ├── constants         # Constants for dependency injection
├── config
│   ├── database.config.ts # Relational database configuration
│   ├── mongo.config.ts    # Non-relational database configuration
├── modules
│   ├── name_module
│   │   ├── name_module.controller.ts  # API endpoints
│   │   ├── name_module.module.ts      # Module definition
│   │   ├── dto                        # Data Transfer Objects
│   │   │   ├── example.dto.ts
│   │   ├── entities                   # Database entities
│   │   │   ├── example.entity.ts
│   │   ├── services                   # Business logic
│   │   │   ├── example.service.ts
│   │   │   ├── from_other_module.service.ts
├── main.ts                   # Application entry point
tsconfig.json
tsconfig.build.json
```

## Contributing

This project follows the **GitFlow** branching model. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Run the linter (`npm run lint` or `yarn lint`) to ensure code quality.
5. Push to your branch (`git push origin feature/your-feature`).
6. Open a pull request to the `develop` branch.

## Dependencies

- **NestJS**: v10.0.0
- **Node.js**: v22.14.0

Refer to `package.json` for additional dependencies.

## Changelog

### Version 0.0.1 - [May 2025]

- Initial setup of the NestJS TypeScript starter repository.
- Configured project structure with modular architecture.
- Added support for relational and non-relational databases.

## License

This project is [MIT licensed](LICENSE).

## Stay in touch

- Author - Miguel Martinez ([GitHub](https://github.com/mikezxcv))