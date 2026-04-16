import { defineCatalog } from '@json-render/core';
import type { Catalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { z } from 'zod';

export const olwibaComponentDefinitions = {
  PageHeader: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Page title with optional description',
    slots: ['default'],
  },
  Spinner: {
    props: z.object({
      className: z.string().optional(),
      size: z.enum(['sm', 'md', 'lg']).optional(),
    }),
    description: 'Loading spinner',
  },
  GlassCard: {
    props: z.object({
      blur: z.enum(['sm', 'md', 'lg']).optional(),
      className: z.string().optional(),
    }),
    description: 'Frosted glass card container',
    slots: ['default'],
  },
  FeatureCard: {
    props: z.object({
      title: z.string(),
      description: z.string(),
      href: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Feature highlight card with icon and optional link',
  },
  StatCard: {
    props: z.object({
      value: z.string(),
      label: z.string(),
      delta: z.string().optional(),
      trend: z.enum(['up', 'down', 'neutral']).optional(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Stat metric card with optional trend indicator',
  },
  TestimonialCard: {
    props: z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      company: z.string().optional(),
      avatar: z.string().optional(),
      initials: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Testimonial quote with author attribution',
  },
  PricingCard: {
    props: z.object({
      name: z.string(),
      price: z.string(),
      period: z.string().optional(),
      description: z.string(),
      features: z.array(z.object({ label: z.string(), included: z.boolean() })),
      cta: z.string(),
      highlighted: z.boolean().optional(),
      badge: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Pricing tier card with feature list and CTA',
  },
  ImageCard: {
    props: z.object({
      src: z.string(),
      alt: z.string().optional(),
      overlay: z.enum(['none', 'subtle', 'strong']).optional(),
      aspectRatio: z.enum(['video', 'square', 'portrait', 'auto']).optional(),
      className: z.string().optional(),
    }),
    description: 'Image card with optional overlay',
    slots: ['default'],
  },
  EmptyState: {
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      className: z.string().optional(),
    }),
    description: 'Empty state placeholder with title and description',
  },
  Kbd: {
    props: z.object({
      keys: z.union([z.string(), z.array(z.string())]),
      className: z.string().optional(),
    }),
    description: 'Keyboard shortcut display',
  },
  GradientBackground: {
    props: z.object({
      variant: z.enum(['mesh', 'radial', 'aurora']).optional(),
      animated: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Decorative gradient background layer',
    slots: ['default'],
  },
  GridPattern: {
    props: z.object({
      variant: z.enum(['dots', 'lines', 'cross']).optional(),
      size: z.number().optional(),
      className: z.string().optional(),
    }),
    description: 'Decorative grid/dot pattern overlay',
  },
  NoiseOverlay: {
    props: z.object({
      opacity: z.number().optional(),
      className: z.string().optional(),
    }),
    description: 'Subtle noise texture overlay',
  },
  GlowEffect: {
    props: z.object({
      size: z.number().optional(),
      color: z.string().optional(),
      followCursor: z.boolean().optional(),
      blur: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      className: z.string().optional(),
    }),
    description: 'Ambient glow effect',
  },
  CountUp: {
    props: z.object({
      from: z.number().optional(),
      to: z.number(),
      duration: z.number().optional(),
      decimals: z.number().optional(),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
      once: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Animated number counter',
  },
  FadeIn: {
    props: z.object({
      delay: z.number().optional(),
      duration: z.number().optional(),
      direction: z.enum(['up', 'down', 'left', 'right', 'none']).optional(),
      once: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: 'Fade-in animation wrapper',
    slots: ['default'],
  },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catalog: Catalog = defineCatalog(schema, {
  components: olwibaComponentDefinitions,
  actions: {
    navigate: { description: 'Navigate to a route' },
  },
}) as unknown as Catalog;
