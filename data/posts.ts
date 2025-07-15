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
        id: "4",
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
];
