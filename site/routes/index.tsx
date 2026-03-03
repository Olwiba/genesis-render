import { createFileRoute, Link } from '@tanstack/react-router';
import { AsciiText, Button } from '@olwiba/cn';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] justify-center items-center px-4 py-16 text-center">
      <AsciiText text="gRender" accent="Render" accentColor="var(--primary)" />
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        Lightweight JSON-to-UI mapping engine. Define pages as block specs, render them as{' '}
        <span className="text-foreground font-medium">@olwiba/ui</span> components.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/docs/$" params={{ _splat: '' }}>
            Get Started
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/docs/$" params={{ _splat: 'blocks' }}>
            Blocks
          </Link>
        </Button>
      </div>
    </div>
  );
}
