INSERT INTO "User" (id, name, email, password, role, "updatedAt")
VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
RETURNING *;
