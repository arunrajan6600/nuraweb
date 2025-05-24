SELECT p.*, u.name as author_name
FROM "Project" p
JOIN "User" u ON p."authorId" = u.id
WHERE p.slug = $1;
