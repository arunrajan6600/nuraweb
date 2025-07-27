import { Post } from "@/types/post";

export const posts: Post[] = [
  {
    title: "Bhasha Naishadha Ambu / ഭാഷാ നൈഷധ അമ്പു",
    // "thumbnail": {
    //   "url": "/media/nura/FILES/website_nuraweb_Files/public/images/projects/bhashanaishadham_ambu/bhashanaishadhaambu_screenshot.jpg",
    //   "alt": "Abstract digital art installation thumbnail"
    // },
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          'Bhasha Naishadha Ambu is an experiment to find and manipulate the numerical data from a vector embedding AI model and compare the vector values with the positions of 3D points from a masked video of Ambu (the child). Then the words corresponding to the positional values from video is selected and superimposed over the video. The fundamental intention of this experiment is to explore how language, pixels, vectors are all interconnected in a world of pseudo-futurism which might transformed to a "future". \nVideo Credits: Rajesh Karthy, Dr. Jaseera Majid',
      },
      {
        id: "2",
        type: "video",
        content: {
          url: "https://youtu.be/CxX3SFSz3RQ",
          title: "bhasha naishadha ambu",
          provider: "youtube",
        },
      },
      {
        id: "3",
        type: "video",
        content: {
          url: "https://youtu.be/IAmrl1hbgPE",
          title: "interactive",
          provider: "youtube",
        },
      },
    ],
    status: "published",
    featured: true,
    type: "project",
    id: "1",
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2025-06-18T07:11:08.213Z",
  },
  {
    title: "ഹത്യ",
    // "thumbnail": {
    //   "url": "",
    //   "alt": ""
    // },
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          'അവൾ ജയിലിലെ ഇരുമ്പഴികൾക്കിടയിലൂടെ അവന്റെ വിരലുകളിൽ പിടിച്ചു മരിച്ച ഈറനണിഞ്ഞ കണ്ണുകളോടെ അവന്റെ മുഖത്തേക്ക് നോക്കി നിന്നു.\n\nപെട്ടെന്ന് എന്തോ ഓർത്ത് അവൻ പറഞ്ഞു \n\nഅയാൾ എനിക്ക്   "ഒരു മരത്തിൽ കൂടിയിരിക്കും പറവൈ" എന്ന പാട്ട് അയച്ചു തന്നു.\n\nഅവൾ ഞെട്ടിത്തരിച്ചു വായ കൈകൾ കൊണ്ട് പൊതി. കണ്ണുകളിൽ ഭയം തിളങ്ങി.\n\n"സൗന്ദർരാജൻ -രാജേശ്വരി യോ അതോ പി സുശീലയോ ?" വിക്കി വിക്കി അവൾ ചോദിച്ചു \n\nഅവളുടെ ഭാവമാറ്റം കണ്ടപ്പോൾ അവനും പകച്ചു.\n\n"സൗന്ദർരാജൻ -രാജേശ്വരി"\n\n"ദൈവമേ...!!!" - എങ്ങും ഭയം മാത്രം \n\n\n\n(തുടരും...)\n\n',
      },
    ],
    status: "published",
    featured: true,
    type: "blog",
    id: "3",
    createdAt: "2025-06-15T09:00:00.000Z",
    updatedAt: "2025-06-18T11:45:22.331Z",
  },
  {
    title: "The Impact of Vector Embeddings on Modern NLP",
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          "This paper explores the transformative role of vector embeddings in natural language processing, examining their mathematical foundations and practical applications. We analyze the evolution from sparse representations to dense vector spaces and their implications for semantic understanding in computational linguistics. Our research demonstrates significant improvements in downstream tasks when utilizing contextualized embeddings over traditional bag-of-words models.",
      },
    ],
    status: "published",
    featured: false,
    type: "paper",
    id: "4",
    createdAt: "2025-07-10T14:30:00.000Z",
    updatedAt: "2025-07-10T14:30:00.000Z",
  },
  {
    title: "Building Scalable Web Applications with Next.js",
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          "Next.js has revolutionized the way we build React applications by providing a comprehensive framework that handles server-side rendering, static site generation, and API routes out of the box. In this article, we'll explore best practices for building scalable applications, optimizing performance, and leveraging the latest features like the App Router for better developer experience and user performance.",
      },
    ],
    status: "published",
    featured: false,
    type: "article",
    id: "5",
    createdAt: "2025-07-15T10:15:00.000Z",
    updatedAt: "2025-07-15T10:15:00.000Z",
  },
  {
    title: "Local Artist Wins International Digital Art Competition",
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          "A groundbreaking digital art installation by local artist has been awarded first place at the International Digital Arts Festival. The piece, which combines traditional storytelling with cutting-edge AI technology, has garnered attention from critics worldwide. The installation explores themes of language, identity, and technology through an innovative use of vector embeddings and real-time video processing.",
      },
    ],
    status: "published",
    featured: false,
    type: "news",
    id: "6",
    createdAt: "2025-07-20T16:45:00.000Z",
    updatedAt: "2025-07-20T16:45:00.000Z",
  },
  {
    title: "OpenAI GPT-4 Research Paper",
    cells: [
      {
        id: "1",
        type: "markdown",
        content:
          "Link to the official OpenAI research paper on GPT-4 architecture and capabilities. This comprehensive document details the model's training methodology, performance benchmarks, and safety considerations.\n\nhttps://arxiv.org/abs/2303.08774",
      },
    ],
    status: "published",
    featured: false,
    type: "link",
    id: "7",
    createdAt: "2025-07-22T09:20:00.000Z",
    updatedAt: "2025-07-22T09:20:00.000Z",
  },
];
