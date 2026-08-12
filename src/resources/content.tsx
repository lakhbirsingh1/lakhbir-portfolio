import { About, Gallery, Home, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Lakhbir",
  lastName: "Singh",
  name: `Lakhbir Singh`,
  role: "Visual Designer",
  avatar: "/images/avatar.png",
  email: "singh0167p@gmail.com",
  // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Hindi", "Punjabi"], // optional: Leave the array empty if you don't want to display languages
  locale: "en", // BCP 47 language tag for the HTML lang attribute, e.g., 'en', 'ja', 'zh-TW'
};



const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/lakhbirsingh1",
    essential: true,
  },
  {
    name: "Youtube",
    icon: "youtube",
    link: "https://www.youtube.com/@Lakhbir.Visuals",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/lakhbir.visuals/",
    essential: true,
  },
  {
    name: "Threads",
    icon: "threads",
    link: "https://www.instagram.com/lakhbir.visuals/",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.png",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio showcasing motion design, video editing, UI animations, and web experiences by ${person.role}`,
  headline: <>Designing visuals that move, inspire, and engage.</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Lakhbir.Visuals</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      I'm {person.firstName}, at {person.role.toLowerCase()} at{" "}
      <Text as="span" size="xl" weight="strong">Lakhbir Visuals</Text>, creating motion graphics, product videos, <br />  and modern digital experiences through storytelling and design.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, a Motion Designer, Video Editor, and Web Designer creating digital experiences. ${person.role} from `,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "/work",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        <>
          I help brands and businesses create engaging motion graphics, product demo videos, social media content, UI animations, and modern websites that deliver clear, impactful visual experiences.
        </>
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Selected Projects",
        timeframe: "2026 - Present",
        role: "Motion Designer • Video Editor • Web Designer",
        achievements: [
          <>
            Created motion graphics, product demo videos, social media content, UI animations, and promotional videos using Adobe After Effects, Premiere Pro, and CapCut.
          </>,
          <>
            Designed responsive websites and modern landing pages using HTML, CSS, JavaScript, React, Next.js, and Tailwind CSS with a focus on performance and user experience.
          </>,
          <>
            Worked on personal, freelance, and practice projects to strengthen skills in visual storytelling, branding, and modern web design.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/NextRole.png",
            alt: "Portfolio Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/Bislova.png",
            alt: "Portfolio Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/Realestate.png",
            alt: "Portfolio Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/WorldOrder.png",
            alt: "Portfolio Project",
            width: 16,
            height: 9,
          },
        ],
      },

    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Ambala",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "After Effects",
        description: (
          <>
            Creating motion graphics, UI animations, explainer videos, product demos, logo animations, and social media content with smooth transitions and professional visual storytelling.
          </>
        ),
        tags: [
          {
            name: "After Effects",
            icon: "aftereffects",
          },
          {
            name: "Motion Graphics",
          },
          {
            name: "UI Animation",
          },
          {
            name: "Explainer Videos",
          },
        ],
        images: [
          {
            src: "/images/projects/project-01/1.png",
            alt: "Motion Graphics Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/2.png",
            alt: "UI Animation",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Video Editing",
        description: (
          <>
            Editing engaging social media videos, reels, shorts, product videos, and promotional content using Premiere Pro and CapCut with a focus on storytelling and pacing.
          </>
        ),
        tags: [
          {
            name: "Premiere Pro",
            icon: "premierepro",
          },
          {
            name: "CapCut",
          },
          {
            name: "Social Media",
          },
          {
            name: "Short-form Video",
          },
          {
            name: "Long-form Video",
          },
        ],
      },
      {
        title: "Web Design",
        description: (
          <>
            Designing responsive websites and modern landing pages using HTML, CSS, JavaScript, React, Next.js, and Tailwind CSS.
          </>
        ),
        tags: [
          {
            name: "HTML",
          },
          {
            name: "CSS",
          },
          {
            name: "JavaScript",
          },
          {
            name: "React",
          },
          {
            name: "Next.js",
          },
          {
            name: "Tailwind CSS",
          },
        ],
      },
    ],
  },
};



const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [

    {
      src: "/images/gallery/ai-logo.mp4",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/skin-care.mp4",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal.mp4",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-5.mp4",
      alt: "image",
      orientation: "horizontal",
    },

    {
      src: "/images/gallery/vertical-1.mp4",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-1.mp4",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.mp4",
      alt: "image",
      orientation: "vertical",
    },

    {
      src: "/images/gallery/horizontal-2.mp4",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.mp4",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.mp4",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-4.mp4",
      alt: "image",
      orientation: "horizontal",
    },

  ],
};

export { person, social, home, about, work, gallery };
