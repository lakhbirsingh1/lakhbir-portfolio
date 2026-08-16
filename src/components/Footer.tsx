"use client";

import {
  Icon,
  Row,
  Text,
} from "@once-ui-system/core";

import { person, social } from "@/resources";

import {
  trackExternalLink,
  trackContact,
} from "@/lib/analytics/track-interaction";

import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (
    item: (typeof social)[number],
  ) => {
    if (!item.link) {
      return;
    }

    const name = item.name.toLowerCase();

    // ---------------------------------------------
    // EMAIL
    // ---------------------------------------------

    if (name === "email") {
      void trackContact({
        type: "email",
        value: item.link,
      });

      return;
    }

    // ---------------------------------------------
    // EXTERNAL LINK
    // ---------------------------------------------

    if (item.link.startsWith("http")) {
      void trackExternalLink({
        name: item.name,
        url: item.link,
        elementId: `social-${name}`,
        metadata: {
          source: "footer",
        },
      });
    }
  };

  return (
    <Row
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      s={{
        direction: "column",
      }}
    >
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        {/* COPYRIGHT */}

        <Text
          variant="body-default-s"
          onBackground="neutral-strong"
        >
          <Text onBackground="neutral-weak">
            © {currentYear} /
          </Text>

          <Text paddingX="4">
            {person.name}
          </Text>

          <Text onBackground="neutral-weak">
            / Crafted with ❤️ using Next.js & Vercel.{" "}
            Lakhbir.Visuals
          </Text>
        </Text>

        {/* SOCIAL LINKS */}

        <Row gap="16">
          {social.map((item) => {
            if (!item.link) {
              return null;
            }

            const isEmail =
              item.name.toLowerCase() === "email";

            return (
              <a
                key={item.name}
                href={item.link}
                aria-label={item.name}
                title={item.name}
                onClick={() => {
                  console.log(
                    "FOOTER CLICK:",
                    item.name,
                  );

                  handleSocialClick(item);
                }}
                style={{
                  width: "32px",
                  height: "32px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Icon
                    name={item.icon}
                    size="s"
                  />
                </span>
              </a>
            );
          })}
        </Row>
      </Row>

      <Row
        height="80"
        hide
        s={{
          hide: false,
        }}
      />
    </Row>
  );
};