CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    "emailVerified" TIMESTAMP,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "BlogPost" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    cells TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "authorId" TEXT NOT NULL REFERENCES "User"(id)
);

CREATE TABLE IF NOT EXISTS "Project" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    cells TEXT NOT NULL,
    "imageUrl" TEXT,
    "demoUrl" TEXT,
    "sourceUrl" TEXT,
    technologies TEXT NOT NULL,
    category TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "authorId" TEXT NOT NULL REFERENCES "User"(id)
);
