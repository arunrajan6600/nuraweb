SELECT p.*, u.name as author_name, u.image as author_image
FROM "BlogPost" p
JOIN "User" u ON p."authorId" = u.id
WHERE p.slug = $1;
