import { defineRegistry } from '@json-render/react';
import {
  PageHeader,
  Spinner,
  GlassCard,
  FeatureCard,
  StatCard,
  TestimonialCard,
  PricingCard,
  ImageCard,
  EmptyState,
  Kbd,
  GradientBackground,
  GridPattern,
  NoiseOverlay,
  GlowEffect,
  CountUp,
  FadeIn,
} from '@olwiba/ui';
import { catalog } from './catalog';

export const olwibaComponents = {
  PageHeader: ({ props, children }) => <PageHeader {...props}>{children}</PageHeader>,
  Spinner: ({ props }) => <Spinner {...props} />,
  GlassCard: ({ props, children }) => <GlassCard {...props}>{children}</GlassCard>,
  FeatureCard: ({ props }) => <FeatureCard {...props} />,
  StatCard: ({ props }) => <StatCard {...props} />,
  TestimonialCard: ({ props }) => <TestimonialCard {...props} />,
  PricingCard: ({ props }) => <PricingCard {...props} />,
  ImageCard: ({ props, children }) => <ImageCard {...props}>{children}</ImageCard>,
  EmptyState: ({ props }) => <EmptyState {...props} />,
  Kbd: ({ props }) => <Kbd {...props} />,
  GradientBackground: ({ props, children }) => <GradientBackground {...props}>{children}</GradientBackground>,
  GridPattern: ({ props }) => <GridPattern {...props} />,
  NoiseOverlay: ({ props }) => <NoiseOverlay {...props} />,
  GlowEffect: ({ props }) => <GlowEffect {...props} />,
  CountUp: ({ props }) => <CountUp {...props} />,
  FadeIn: ({ props, children }) => <FadeIn {...props}>{children}</FadeIn>,
} as const;

export const { registry } = defineRegistry(catalog, {
  components: olwibaComponents,
  actions: {
    navigate: () => {},
  },
});
