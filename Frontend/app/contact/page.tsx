import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PulseLaunch team to feature a product or share feedback.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact PulseLaunch",
    description: "Get in touch with the PulseLaunch team to feature a product or share feedback.",
    url: "/contact",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Contact PulseLaunch",
    description: "Get in touch with the PulseLaunch team to feature a product or share feedback."
  }
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Let&apos;s build together</h1>
        <p className="text-base text-muted-foreground">
          Have feedback or want to feature your product? Send us a note and we&apos;ll respond quickly.
        </p>
      </section>

      <Card className="p-6 md:p-8">
        <form className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Name</label>
            <Input placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Message</label>
            <Textarea placeholder="Tell us about your product or feedback." />
          </div>
          <div className="md:col-span-2">
            <Button type="button">Send message</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
