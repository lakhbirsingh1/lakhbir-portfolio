import { IconName } from "@/resources/icons";
import { zones } from "tzdata";

/**
 * IANA time zone string
 */
export type IANATimeZone = Extract<keyof typeof zones, string>;

/**
 * Represents a person featured in the portfolio.
 */
export type Person = {
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  location?: IANATimeZone;
  languages?: string[];
  locale?: string;
};

/**
 * Newsletter Section
 */
export type Newsletter = {
  display: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
};

/**
 * Social link configuration.
 */
export type Social = Array<{
  name: string;
  icon: IconName;
  link: string;
  essential?: boolean;
}>;

/**
 * Base interface for page configuration.
 */
export interface BasePageConfig {
  path: `/${string}` | string;
  label: string;
  title: string;
  description: string;
  image?: `/images/${string}` | string;
}

/**
 * Home page configuration.
 */
export interface Home extends BasePageConfig {
  image: `/images/${string}` | string;
  headline: React.ReactNode;

  featured: {
    display: boolean;
    title: React.ReactNode;
    href: string;
  };

  subline: React.ReactNode;
}

/**
 * About page configuration.
 */
export interface About extends BasePageConfig {
  tableOfContent: {
    display: boolean;
    subItems: boolean;
  };

  avatar: {
    display: boolean;
  };

  calendar: {
    display: boolean;
    link: string;
  };

  intro: {
    display: boolean;
    title: string;
    description: React.ReactNode;
  };

  work: {
    display: boolean;
    title: string;

    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: React.ReactNode[];

      images?: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };

  studies: {
    display: boolean;
    title: string;

    institutions: Array<{
      name: string;
      description: React.ReactNode;
    }>;
  };

  technical: {
    display: boolean;
    title: string;

    skills: Array<{
      title: string;
      description?: React.ReactNode;

      tags?: Array<{
        name: string;
        icon?: string;
      }>;

      images?: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
}

/**
 * Blog page configuration.
 */
export interface Blog extends BasePageConfig {}

/**
 * Work / Projects page configuration.
 */
export interface Work extends BasePageConfig {}

/**
 * Allowed gallery orientations.
 */
export type GalleryOrientation =
  | "horizontal"
  | "vertical"
  | "ai";

/**
 * Gallery image configuration.
 */
export type GalleryImage = {
  src: string;
  alt: string;
  orientation: GalleryOrientation;
};

/**
 * Gallery page configuration.
 */
export interface Gallery extends BasePageConfig {
  images: GalleryImage[];
}