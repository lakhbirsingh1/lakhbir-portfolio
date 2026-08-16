"use client";

import { useMemo, useState } from "react";
import {
  Background,
  Button,
  Card,
  Column,
  Heading,
  Row,
  Text,
} from "@once-ui-system/core";

import { HiChartBar } from "react-icons/hi2";

import { iconLibrary } from "@/resources/icons";

type SectionKey =
  | "visitors"
  | "pages"
  | "clicks"
  | "videos"
  | "downloads"
  | "activity";

type AnalyticsSection = {
  key: SectionKey;
  title: string;
  description: string;
  value: string;
  label: string;
  icon: keyof typeof iconLibrary;
};

const overviewCards = [
  {
    label: "Total Visitors",
    value: "—",
    change: "Waiting for data",
    icon: "person",
  },
  {
    label: "Page Views",
    value: "—",
    change: "Waiting for data",
    icon: "eye",
  },
  {
    label: "Sessions",
    value: "—",
    change: "Waiting for data",
    icon: "grid",
  },
  {
    label: "Avg. Session",
    value: "—",
    change: "Waiting for data",
    icon: "calendar",
  },
] as const;

const analyticsSections: AnalyticsSection[] = [
  {
    key: "visitors",
    title: "Visitors",
    description:
      "Understand who is visiting your portfolio and how visitors return over time.",
    icon: "person",
    value: "—",
    label: "Visitors tracked",
  },
  {
    key: "pages",
    title: "Pages",
    description:
      "See which portfolio pages attract the most attention and engagement.",
    icon: "grid",
    value: "—",
    label: "Page views",
  },
  {
    key: "clicks",
    title: "Clicks",
    description:
      "Track project cards, buttons, social links and external destinations.",
    icon: "arrowUpRight",
    value: "—",
    label: "Interactions",
  },
  {
    key: "videos",
    title: "Videos",
    description:
      "Track plays, watch duration, completion rate, pauses and seeks.",
    icon: "play",
    value: "—",
    label: "Video plays",
  },
  {
    key: "downloads",
    title: "Downloads",
    description:
      "Monitor CV, project assets and other downloadable resources.",
    icon: "document",
    value: "—",
    label: "Downloads",
  },
  {
    key: "activity",
    title: "Recent Activity",
    description:
      "A live-style feed of the latest visitor and portfolio interactions.",
    icon: "calendar",
    value: "—",
    label: "Events",
  },
];

const dialogContent: Record<
  SectionKey,
  {
    title: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
  }
> = {
  visitors: {
    title: "Visitor Analytics",
    description:
      "Detailed information about people visiting your portfolio.",
    stats: [
      { label: "Total visitors", value: "—" },
      { label: "New visitors", value: "—" },
      { label: "Returning visitors", value: "—" },
      { label: "Desktop visitors", value: "—" },
      { label: "Mobile visitors", value: "—" },
      { label: "Tablet visitors", value: "—" },
    ],
  },

  pages: {
    title: "Page Analytics",
    description:
      "Understand which pages are getting the most attention.",
    stats: [
      { label: "Total page views", value: "—" },
      { label: "Most viewed page", value: "—" },
      { label: "Unique pages visited", value: "—" },
      { label: "Top landing page", value: "—" },
      { label: "Average views / visitor", value: "—" },
      { label: "Bounce activity", value: "—" },
    ],
  },

  clicks: {
    title: "Click Analytics",
    description:
      "Track interactions with buttons, projects and external links.",
    stats: [
      { label: "Total interactions", value: "—" },
      { label: "Project clicks", value: "—" },
      { label: "Social clicks", value: "—" },
      { label: "External links", value: "—" },
      { label: "CTA clicks", value: "—" },
      { label: "Most clicked element", value: "—" },
    ],
  },

  videos: {
    title: "Video Analytics",
    description:
      "Track video performance across your portfolio.",
    stats: [
      { label: "Total plays", value: "—" },
      { label: "Completed videos", value: "—" },
      { label: "Completion rate", value: "—" },
      { label: "Average watch time", value: "—" },
      { label: "Pauses", value: "—" },
      { label: "Most watched video", value: "—" },
    ],
  },

  downloads: {
    title: "Download Analytics",
    description:
      "Monitor downloadable resources such as your CV and project assets.",
    stats: [
      { label: "Total downloads", value: "—" },
      { label: "CV downloads", value: "—" },
      { label: "Project assets", value: "—" },
      { label: "Most downloaded", value: "—" },
      { label: "Unique downloaders", value: "—" },
      { label: "Latest download", value: "—" },
    ],
  },

  activity: {
    title: "Recent Activity",
    description:
      "Latest interactions happening across your portfolio.",
    stats: [
      { label: "Total events", value: "—" },
      { label: "Latest visitor", value: "—" },
      { label: "Latest page view", value: "—" },
      { label: "Latest click", value: "—" },
      { label: "Latest video event", value: "—" },
      { label: "Latest download", value: "—" },
    ],
  },
};

export default function AnalyticsPage() {
  const [activeDialog, setActiveDialog] =
    useState<SectionKey | null>(null);

  const activeSection = useMemo(() => {
    if (!activeDialog) {
      return null;
    }

    return analyticsSections.find(
      (section) => section.key === activeDialog,
    );
  }, [activeDialog]);

  const activeContent = activeDialog
    ? dialogContent[activeDialog]
    : null;

  return (
    <>
      <Column
        fillWidth
        paddingY="xl"
        gap="xl"
        position="relative"
        style={{
          minHeight: "100vh",
        }}
      >
        <Background
          mask={{
            x: 50,
            y: 0,
            radius: 100,
            cursor: false,
          }}
          dots={{
            display: true,
            opacity: 20,
            size: "2",
            color: "brand-background-strong",
          }}
        />

        <Column
          fillWidth
          gap="xl"
          position="relative"
          style={{
            zIndex: 1,
          }}
        >
          {/* =====================================================
              HEADER
              ===================================================== */}

          <Row
            fillWidth
            horizontal="between"
            vertical="center"
            gap="m"
            wrap
          >
            <Column gap="8">
              <Row gap="12" vertical="center">
                <HiChartBar
                  size={24}
                  style={{
                    color: "var(--brand-strong)",
                  }}
                />

                <Heading variant="display-strong-s">
                  Portfolio Analytics
                </Heading>
              </Row>

              <Text
                variant="body-default-m"
                onBackground="neutral-weak"
              >
                Private analytics dashboard for your portfolio.
              </Text>
            </Column>

            <Button
              variant="secondary"
              prefixIcon="refresh"
              size="m"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Row>

          {/* =====================================================
              STATUS
              ===================================================== */}

          <Card
            fillWidth
            padding="l"
            radius="l"
            border="neutral-alpha-weak"
            background="surface"
          >
            <Row
              fillWidth
              horizontal="between"
              vertical="center"
              gap="m"
              wrap
            >
              <Row gap="12" vertical="center">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      "var(--success-strong)",
                    display: "block",
                    boxShadow:
                      "0 0 0 4px var(--success-alpha-weak)",
                  }}
                />

                <Column gap="4">
                  <Text variant="label-strong-m">
                    Analytics tracking active
                  </Text>

                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                  >
                    Visitor and session events are being
                    collected.
                  </Text>
                </Column>
              </Row>

              <Text
                variant="label-default-s"
                onBackground="neutral-weak"
              >
                Supabase
              </Text>
            </Row>
          </Card>

          {/* =====================================================
              OVERVIEW
              ===================================================== */}

          <Column gap="m" fillWidth>
            <Column gap="4">
              <Heading variant="heading-strong-l">
                Overview
              </Heading>

              <Text
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                Your portfolio performance at a glance.
              </Text>
            </Column>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: 16,
                width: "100%",
              }}
            >
              {overviewCards.map((card) => {
                const CardIcon =
                  iconLibrary[card.icon];

                return (
                  <Card
                    key={card.label}
                    padding="l"
                    radius="l"
                    border="neutral-alpha-weak"
                    background="surface"
                  >
                    <Column gap="l">
                      <Row
                        fillWidth
                        horizontal="between"
                        vertical="center"
                      >
                        <Text
                          variant="label-default-m"
                          onBackground="neutral-weak"
                        >
                          {card.label}
                        </Text>

                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            display: "grid",
                            placeItems: "center",
                            background:
                              "var(--brand-alpha-weak)",
                          }}
                        >
                          <CardIcon size={19} />
                        </div>
                      </Row>

                      <Column gap="4">
                        <Heading variant="display-strong-s">
                          {card.value}
                        </Heading>

                        <Text
                          variant="body-default-xs"
                          onBackground="neutral-weak"
                        >
                          {card.change}
                        </Text>
                      </Column>
                    </Column>
                  </Card>
                );
              })}
            </div>
          </Column>

          {/* =====================================================
              ANALYTICS BENTO
              ===================================================== */}

          <Column gap="m" fillWidth>
            <Column gap="4">
              <Heading variant="heading-strong-l">
                Analytics
              </Heading>

              <Text
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                Detailed visitor, content and interaction
                analytics.
              </Text>
            </Column>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: 16,
                width: "100%",
              }}
            >
              {analyticsSections.map((section, index) => {
                const SectionIcon =
                  iconLibrary[section.icon];

                const isLarge =
                  index === 4 || index === 5;

                return (
                  <div
                    key={section.key}
                    style={{
                      gridColumn: isLarge
                        ? "span 2"
                        : "span 1",
                    }}
                  >
                    <Card
                      padding="l"
                      radius="l"
                      border="neutral-alpha-weak"
                      background="surface"
                    >
                      <Column gap="l">
                        <Row
                          fillWidth
                          horizontal="between"
                          vertical="center"
                        >
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 14,
                              display: "grid",
                              placeItems: "center",
                              background:
                                "var(--brand-alpha-weak)",
                            }}
                          >
                            <SectionIcon size={21} />
                          </div>

                          <Text
                            variant="display-strong-xs"
                            onBackground="neutral-strong"
                          >
                            {section.value}
                          </Text>
                        </Row>

                        <Column gap="8">
                          <Heading variant="heading-strong-m">
                            {section.title}
                          </Heading>

                          <Text
                            variant="body-default-s"
                            onBackground="neutral-weak"
                          >
                            {section.description}
                          </Text>
                        </Column>

                        <Row
                          fillWidth
                          horizontal="between"
                          vertical="center"
                        >
                          <Text
                            variant="label-default-s"
                            onBackground="neutral-weak"
                          >
                            {section.label}
                          </Text>

                          <Button
                            variant="tertiary"
                            size="s"
                            onClick={() =>
                              setActiveDialog(
                                section.key,
                              )
                            }
                          >
                            View →
                          </Button>
                        </Row>
                      </Column>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Column>
        </Column>
      </Column>

      {/* =====================================================
          PREMIUM ANALYTICS MODAL
          ===================================================== */}

      {activeDialog &&
        activeSection &&
        activeContent && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-dialog-title"
            onClick={() =>
              setActiveDialog(null)
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background:
                "rgba(0, 0, 0, 0.72)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter:
                "blur(18px)",
            }}
          >
            {/* =================================================
                MODAL
                ================================================= */}

            <div
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                width: "min(820px, 100%)",
                maxHeight:
                  "min(760px, calc(100vh - 40px))",
                overflowY: "auto",
                position: "relative",
                borderRadius: 28,
                border:
                  "1px solid var(--neutral-alpha-medium)",
                background:
                  "var(--surface)",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,.42)",
                scrollbarWidth: "thin",
              }}
            >
              {/* =================================================
                  TOP ACCENT
                  ================================================= */}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  borderRadius:
                    "28px 28px 0 0",
                  background:
                    "linear-gradient(90deg, var(--brand-strong), transparent)",
                  opacity: 0.9,
                }}
              />

              <Column
                fillWidth
                gap="xl"
                padding="xl"
              >
                {/* =================================================
                    HEADER
                    ================================================= */}

                <Row
                  fillWidth
                  horizontal="between"
                  vertical="start"
                  gap="l"
                >
                  <Row
                    gap="16"
                    vertical="center"
                  >
                    {(() => {
                      const ActiveIcon =
                        iconLibrary[
                          activeSection.icon
                        ];

                      return (
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            borderRadius: 18,
                            display: "grid",
                            placeItems: "center",
                            background:
                              "var(--brand-alpha-weak)",
                            border:
                              "1px solid var(--brand-alpha-medium)",
                            boxShadow:
                              "0 8px 30px rgba(0,0,0,.08)",
                          }}
                        >
                          <ActiveIcon size={25} />
                        </div>
                      );
                    })()}

                    <Column>
                      <Row
                        gap="8"
                        vertical="center"
                      >
                        <Heading
                          id="analytics-dialog-title"
                          variant="heading-strong-l"
                        >
                          {activeContent.title}
                        </Heading>

                        <span
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            padding: "4px 8px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing:
                              "0.04em",
                            textTransform:
                              "uppercase",
                            background:
                              "var(--success-alpha-weak)",
                            color:
                              "var(--success-strong)",
                          }}
                        >
                          Live
                        </span>
                      </Row>

                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                      >
                        {activeContent.description}
                      </Text>
                    </Column>
                  </Row>

                  {/* =================================================
                      CLOSE BUTTON
                      ================================================= */}

                  <button
                    type="button"
                    aria-label="Close analytics dialog"
                    onClick={() =>
                      setActiveDialog(
                        null,
                      )
                    }
                    style={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      border: 0,
                      borderRadius: 12,
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "var(--neutral-alpha-weak)",
                      color:
                        "var(--neutral-on-background-strong)",
                      fontSize: 22,
                      lineHeight: 1,
                      transition:
                        "background 160ms ease, transform 160ms ease",
                    }}
                    onMouseEnter={(
                      event,
                    ) => {
                      event.currentTarget.style.background =
                        "var(--neutral-alpha-medium)";

                      event.currentTarget.style.transform =
                        "scale(1.04)";
                    }}
                    onMouseLeave={(
                      event,
                    ) => {
                      event.currentTarget.style.background =
                        "var(--neutral-alpha-weak)";

                      event.currentTarget.style.transform =
                        "scale(1)";
                    }}
                  >
                    ×
                  </button>
                </Row>

                {/* =================================================
                    LIVE STATUS BAR
                    ================================================= */}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: 16,
                    padding:
                      "14px 16px",
                    borderRadius: 16,
                    background:
                      "var(--neutral-alpha-weak)",
                    border:
                      "1px solid var(--neutral-alpha-weak)",
                  }}
                >
                  <Row
                  
                    vertical="center"
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        flexShrink: 0,
                        borderRadius:
                          "50%",
                        background:
                          "var(--success-strong)",
                        boxShadow:
                          "0 0 0 4px var(--success-alpha-weak)",
                      }}
                    />

                    <Text variant="label-strong-s">
                      Analytics tracking active
                    </Text>
                  </Row>

                  <Text
                    variant="label-default-xs"
                    onBackground="neutral-weak"
                  >
                    Real-time data
                  </Text>
                </div>

                {/* =================================================
                    PERFORMANCE OVERVIEW
                    ================================================= */}

                <Column gap="8">
                  <Heading variant="heading-strong-m">
                    Performance overview
                  </Heading>

                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                  >
                    Key metrics collected from
                    your portfolio visitors and
                    interactions.
                  </Text>
                </Column>

                {/* =================================================
                    STAT GRID
                    ================================================= */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: 14,
                    width: "100%",
                  }}
                >
                  {activeContent.stats.map(
                    (stat, index) => (
                      <div
                        key={stat.label}
                        style={{
                          position:
                            "relative",
                          overflow:
                            "hidden",
                          minHeight: 112,
                          padding: 20,
                          borderRadius: 18,
                          border:
                            "1px solid var(--neutral-alpha-weak)",
                          background:
                            "var(--surface)",
                          boxShadow:
                            "0 8px 30px rgba(0,0,0,.04)",
                        }}
                      >
                        {/* DECORATIVE NUMBER */}

                        <div
                          style={{
                            position:
                              "absolute",
                            right: 16,
                            top: 12,
                            fontSize: 42,
                            fontWeight: 800,
                            lineHeight: 1,
                            opacity: 0.035,
                            pointerEvents:
                              "none",
                          }}
                        >
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <Column gap="12">
                          <Text
                            variant="label-default-s"
                            onBackground="neutral-weak"
                          >
                            {stat.label}
                          </Text>

                          <Heading variant="heading-strong-l">
                            {stat.value}
                          </Heading>
                        </Column>
                      </div>
                    ),
                  )}
                </div>

                {/* =================================================
                    DATA STATE
                    ================================================= */}

                <div
                  style={{
                    position:
                      "relative",
                    overflow:
                      "hidden",
                    padding: 20,
                    borderRadius: 20,
                    border:
                      "1px solid var(--brand-alpha-medium)",
                    background:
                      "var(--brand-alpha-weak)",
                  }}
                >
                  <Row
                    fillWidth
                    gap="16"
                    vertical="center"
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        borderRadius: 14,
                        display: "grid",
                        placeItems:
                          "center",
                        background:
                          "var(--surface)",
                        border:
                          "1px solid var(--neutral-alpha-weak)",
                        fontSize: 20,
                      }}
                    >
                      ↗
                    </div>

                    <Column >
                      <Text variant="label-strong-m">
                        Waiting for analytics data
                      </Text>

                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                      >
                        Once visitors interact
                        with your portfolio,
                        the real analytics data
                        will appear here
                        automatically.
                      </Text>
                    </Column>
                  </Row>
                </div>

                {/* =================================================
                    FOOTER
                    ================================================= */}

                <Row
                  fillWidth
                  horizontal="between"
                  vertical="center"
                  gap="m"
                  wrap
                >
                  <Text
                    variant="label-default-xs"
                    onBackground="neutral-weak"
                  >
                    Portfolio Analytics
                  </Text>

                  <Button
                    variant="secondary"
                    size="s"
                    onClick={() =>
                      setActiveDialog(
                        null,
                      )
                    }
                  >
                    Done
                  </Button>
                </Row>
              </Column>
            </div>
          </div>
        )}
    </>
  );
}