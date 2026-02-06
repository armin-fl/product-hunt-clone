export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col gap-3 text-sm text-muted-foreground">
        <p>PulseLaunch is a Product Hunt-inspired discovery hub for modern teams.</p>
        <p>Built with Next.js, Tailwind, shadcn/ui, and a Django backend.</p>
      </div>
    </footer>
  );
}
