"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { site } from "@/lib/data";
import { cn, ease } from "@/lib/utils";
import { FloatingField } from "@/components/ui/floating-field";
import { Button } from "@/components/ui/button";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;

const topics = ["AI / LLM product", "Full-stack build", "Full-time role", "Something else"];

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please share your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email doesn't look quite right.";
  if (v.message.trim().length < 10) e.message = "A sentence or two helps me reply properly.";
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [topic, setTopic] = useState(topics[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const errors = validate(values);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k: Field) => () => setTouched((t) => ({ ...t, [k]: true }));
  const show = (k: Field) => (touched[k] ? errors[k] : undefined);
  const ok = (k: Field) => Boolean(touched[k] && !errors[k]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topic }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setTouched({});
    setStatus("idle");
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-elevated p-6 shadow-lift md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: ease.out }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_0_40px_-4px_var(--accent)]"
            >
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </motion.span>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">Message received.</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">Thanks, {values.name.split(" ")[0]} — I&apos;ll get back to you within a couple of days.</p>
            <Button variant="secondary" size="sm" className="mt-8" onClick={reset}>
              Send another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <fieldset>
              <legend className="mb-3 text-sm text-muted">What are you thinking about?</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={topic === t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      "relative rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300",
                      topic === t ? "border-transparent text-accent-fg" : "border-line text-muted hover:border-line-strong hover:text-fg"
                    )}
                  >
                    {topic === t && (
                      <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                    )}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <FloatingField label="Your name" name="name" autoComplete="name" value={values.name} onChange={set("name")} onBlur={blur("name")} error={show("name")} valid={ok("name")} />
              <FloatingField label="Email address" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} onBlur={blur("email")} error={show("email")} valid={ok("email")} />
            </div>
            <FloatingField label="Tell me a little about it" name="message" multiline value={values.message} onChange={set("message")} onBlur={blur("message")} error={show("message")} valid={ok("message")} />

            <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
              <p className="text-xs text-subtle">
                Prefer email?{" "}
                <a href={`mailto:${site.email}`} className="text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg">
                  {site.email}
                </a>
              </p>
              <Button type="submit" size="lg" magnetic disabled={status === "loading"} data-cursor="Send">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "loading" ? (
                    <motion.span key="l" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending
                    </motion.span>
                  ) : (
                    <motion.span key="s" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      Send message
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <AnimatePresence>
              {status === "error" && (
                <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-red-500">
                  Something went wrong. Please try again or email me directly.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
