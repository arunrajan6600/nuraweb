```sudolang
DEFINE PROJECT "Surya Narayanan"
USING STACK {
    frontend: "NextJS",
    database: "database.json",
    styling: ["Tailwind CSS", "Shadcn UI"],
}

DEFINE TYPE Cell {
    id: STRING,
    type: ENUM("text", "video", "image", "markdown"),
    content: STRING,
    metadata: {
        position: INTEGER,
        created_at: DATE,
        updated_at: DATE
    }
}

DEFINE TYPE Post {
    id: STRING,
    title: STRING,
    thumbnail: IMAGE,
    description: TEXT,
    cells: ARRAY<Cell>,
    type: ENUM("blog", "project"),
    metadata: {
        date: DATE,
        tags: ARRAY<STRING>,
        category: STRING,
        status: ENUM("draft", "published"),
        author: STRING
    }
}

DEFINE COMPONENTS {
    core: {
        Navbar: COMPONENT,
        Footer: COMPONENT
    },

    admin: {
        PostBuilder: {
            cells: ARRAY<CellEditor>,
            preview: COMPONENT,
            toolbar: {
                addCell: BUTTON,
                publish: BUTTON,
                saveDraft: BUTTON
            }
        },
        CellEditor: {
            type: ENUM("text", "video", "image", "markdown"),
            content: DYNAMIC_INPUT,
            dragHandle: COMPONENT,
            deleteButton: BUTTON
        },
        Dashboard: {
            stats: {
                posts: INTEGER,
                drafts: INTEGER,
                views: INTEGER
            },
            recentPosts: ARRAY<Post>,
            quickActions: ARRAY<BUTTON>
        }
    },

    landing: {
        Hero: {
            title: STRING,
            subtitle: STRING,
            callToAction: BUTTON,
            background: "GLSL_SHADER"
        },

        PostsPreview: {
            heading: STRING,
            type: ENUM("blog", "project"),
            viewAllButton: LINK("/${type}s"),
            posts: ARRAY<Post>
        },

        Contact: {
            about: TEXT,
            form: ContactForm,
            info: ContactInfo
        }
    },

    pages: {
        Posts: {
            type: ENUM("blog", "project"),
            items: ARRAY<Post>,
            pagination: COMPONENT,
            filters: {
                category: FILTER,
                date: FILTER,
                tags: FILTER
            }
        },

        About: {
            content: TEXT,
            skills: ARRAY<{
                name: STRING,
                level: ENUM("beginner", "intermediate", "expert")
            }>,
            experience: ARRAY<{
                title: STRING,
                company: STRING,
                description: TEXT,
                duration: STRING
            }>,
            education: ARRAY<{
                degree: STRING,
                institution: STRING,
                duration: STRING
            }>,
            resume: DOWNLOADABLE_PDF,
            contact: {
                form: ContactForm,
                info: ContactInfo
            }
        }
    }
}


```
