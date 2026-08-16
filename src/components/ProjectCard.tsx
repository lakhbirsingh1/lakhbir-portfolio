"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  Text,
} from "@once-ui-system/core";
import { trackClick } from "@/lib/analytics/track-interaction";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
}) => {
  const handleProjectClick = () => {
    void trackClick({
      eventName: "Project Click",
      elementId: "project-card",
      elementText: title,
      targetUrl: href,
      metadata: {
        project: title,
        projectUrl: href,
      },
    });
  };

  return (
    <Column fillWidth gap="m">
      <div
        onClick={handleProjectClick}
        style={{
          cursor: "pointer",
        }}
      >
        <Carousel
          sizes="(max-width: 960px) 100vw, 960px"
          items={images.map((image) => ({
            slide: image,
            alt: title,
          }))}
        />
      </div>

      <Flex
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex
            flex={5}
            onClick={handleProjectClick}
            style={{
              cursor: "pointer",
            }}
          >
            <Heading
              as="h2"
              wrap="balance"
              variant="heading-strong-xl"
            >
              {title}
            </Heading>
          </Flex>
        )}

        {(avatars?.length > 0 ||
          description?.trim() ||
          content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && (
              <AvatarGroup
                avatars={avatars}
                size="m"
                reverse
              />
            )}

            {description?.trim() && (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                {description}
              </Text>
            )}
          </Column>
        )}
      </Flex>
    </Column>
  );
};