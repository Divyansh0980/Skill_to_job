# 🚀 Skill to Job

![Status](https://img.shields.io/badge/Status-In%20Development-blue)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

Welcome to **Skill to Job**! Our mission is to bridge the gap between your current skill set and the requirements of your dream job. The tech industry moves fast, and keeping track of necessary qualifications for specific roles can be overwhelming. This project aims to simplify that journey by analyzing your skills, providing learning tracks, and monitoring your career progress.

## 📖 Overview

The goal of this project is to create an educational and career-driven platform/tool that helps users:
- Identify gaps in their knowledge based on their desired roles.
- Follow targeted learning pathways.
- Keep track of their career readiness.

## 💻 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

---

## 🛠️ Getting Started (Local Development)

Follow these instructions to set up and run the project locally on your system.

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running PostgreSQL database instance (or Docker)
- [Git](https://git-scm.com/)

### 2. Installation

Clone the repository to your local machine:
```bash
git clone https://github.com/Divyansh0980/Skill_to_job.git
cd Skill_to_job
```

Install the project dependencies:
```bash
npm install
# or
# yarn install
# pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root of your project. You will need to configure your database connection string and any required third-party API tokens:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=public"

# GitHub Access Token (for the GitHub Service integration)
GITHUB_ACCESS_TOKEN="your_github_personal_access_token_here"
```
*(Make sure to replace the placeholder values with your actual database credentials and GitHub token).*

### 4. Database Setup

Run the following Prisma commands to generate the Prisma client and sync the schema with your database:

```bash
# Generate the Prisma Client
npx prisma generate

# Push the schema state to your database
npx prisma db push
```

### 5. Running the Application

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running!

---

## 📦 Building for Production

To create an optimized production build, run:
```bash
npm run build
```
To start the production server:
```bash
npm start
```

## 🤝 Contributing

We welcome and appreciate contributions! If you'd like to help build **Skill to Job**:
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. Commit your changes with descriptive messages:
   ```bash
   git commit -m "feat: Add some amazing feature"
   ```
3. Push to your branch and open a Pull Request.

If you find any bugs or have feature ideas, please open an issue first to discuss it!

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as long as you provide attribution.
