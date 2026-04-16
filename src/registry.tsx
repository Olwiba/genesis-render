import { defineRegistry } from '@json-render/react';
import type { BaseComponentProps } from '@json-render/react';
import {
  PageHeader,
  FullPageSpinner,
  GlassCard,
  FeatureCard,
  StatCard,
  TestimonialCard,
  PricingCard,
  ImageCard,
  EmptyState,
  CountUp,
  FadeIn,
} from '@olwiba/ui';
import { catalog } from './catalog';

export const olwibaComponents = {
  PageHeader: ({ props, children }: BaseComponentProps) => <PageHeader {...props}>{children}</PageHeader>,
  Spinner: ({ props }: BaseComponentProps) => <FullPageSpinner {...props} />,
  GlassCard: ({ props, children }: BaseComponentProps) => <GlassCard {...props}>{children}</GlassCard>,
  FeatureCard: ({ props }: BaseComponentProps) => <FeatureCard {...props} />,
  StatCard: ({ props }: BaseComponentProps) => <StatCard {...props} />,
  TestimonialCard: ({ props }: BaseComponentProps) => <TestimonialCard {...props} />,
  PricingCard: ({ props }: BaseComponentProps) => <PricingCard {...props} />,
  ImageCard: ({ props, children }: BaseComponentProps) => <ImageCard {...props}>{children}</ImageCard>,
  EmptyState: ({ props }: BaseComponentProps) => <EmptyState {...props} />,
  CountUp: ({ props }: BaseComponentProps) => <CountUp {...props} />,
  FadeIn: ({ props, children }: BaseComponentProps) => <FadeIn {...props}>{children}</FadeIn>,
} as const;

export const { registry } = defineRegistry(catalog, {
  components: olwibaComponents,
  actions: {
    navigate: () => {},
  },
});
