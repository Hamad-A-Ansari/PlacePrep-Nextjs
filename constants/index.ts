
import { z } from "zod";
import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];


export const generator: CreateWorkflowDTO = {
  "name": "ha_interview_generation",
  "nodes": [
    {
      "name": "introduction",
      "type": "conversation",
      "isStart": true,
      "metadata": {
        "position": {
          "x": -2592.121616309939,
          "y": 333.0270874877679
        }
      },
      "prompt": "Greet the user. Inform them that you will get some information from them, to create a perfect interview. Ask the caller for data required to extract. Ask the questions one by one, and await an answer.",
      "model": {
        "model": "gpt-4o",
        "provider": "openai",
        "maxTokens": 250,
        "temperature": 0.3
      },
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "role",
            "description": "What role would you like to train for?"
          },
          {
            "enum": [],
            "type": "string",
            "title": "type",
            "description": "Are you aiming for a technical, behavioral or mixed interview?"
          },
          {
            "enum": [],
            "type": "string",
            "title": "level",
            "description": "The job experience level."
          },
          {
            "enum": [],
            "type": "string",
            "title": "techstack",
            "description": "List of technologies to cover during the job interview?"
          },
          {
            "enum": [],
            "type": "number",
            "title": "amount",
            "description": "How many questions would you like me to prepare for you?"
          }
        ]
      },
      "messagePlan": {
        "firstMessage": ""
      }
    },
    {
      "name": "apiRequest_1751199143889",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -1922.8761586674116,
          "y": 402.63794570516745
        }
      },
      "tool": {
        "url": "https://place-prep-nextjs.vercel.app/api/vapi/generate",
        "body": {
          "type": "object",
          "required": [
            "role",
            "type",
            "level",
            "amount",
            "userid",
            "techstack"
          ],
          "properties": {
            "role": {
              "type": "string",
              "value": "{{ role }}",
              "description": ""
            },
            "type": {
              "type": "string",
              "value": "{{ type }}",
              "description": ""
            },
            "level": {
              "type": "string",
              "value": "{{ level }}",
              "description": ""
            },
            "amount": {
              "type": "number",
              "value": "{{ amount }}",
              "description": ""
            },
            "userid": {
              "type": "string",
              "value": "{{ userid }}",
              "description": ""
            },
            "techstack": {
              "type": "string",
              "value": "{{ techstack }}",
              "description": ""
            }
          }
        },
        "name": "getUserData",
        "type": "apiRequest",
        "method": "POST",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Please hold on, while I am sending a request to the app for Generating the Interview.",
            "blocking": true
          },
          {
            "role": "assistant",
            "type": "request-complete",
            "content": "The request has been sent and your interview has been generated. Thank you for the call! Bye, Bye!",
            "endCallAfterSpokenEnabled": true
          },
          {
            "type": "request-failed",
            "content": "Oops! Looks like something went wrong when sending the data to the app! Please try again.",
            "endCallAfterSpokenEnabled": true
          }
        ]
      }
    },
    {
      "name": "hangup_1751199613907",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -2041.0747661392984,
          "y": 661.7206724765698
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Everything has been generated. I'll redirect you to the dashboard now, thanks for the call!!",
            "blocking": true
          }
        ]
      }
    }
  ],
  "edges": [
    {
      "from": "introduction",
      "to": "apiRequest_1751199143889",
      "condition": {
        "type": "ai",
        "prompt": "If user provided all the data to be extracted."
      }
    },
    {
      "from": "apiRequest_1751199143889",
      "to": "hangup_1751199613907",
      "condition": {
        "type": "ai",
        "prompt": ""
      }
    }
  ],
  "globalPrompt": "You are a voice assistant helping with creating new AI interviewers. Your task is to collect data from the user. Remember that this is a voice conversation - do not use any special characters."
}