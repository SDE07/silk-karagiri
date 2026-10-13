"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const TOPICS = ["Saree enquiry", "Order & delivery", "Bridal / custom order", "Overseas order", "Something else"];

type Fields = { name: string; phone: string; email: string; topic: string; message: string };
const EMPTY: Fields = { name: "", phone: "", email: "", topic: TOPICS[0], message: "" };

const inputClass =
  "w-full rounded-xl bg-vanilla-custard-900 px-4 py-3 font-body text-[15px] text-ink-black placeholder:text-stone-400 ring-1 ring-stone-200 outline-none transition-[box-shadow,background-color] focus:bg-white focus:ring-2 focus:ring-[#9f2d55]/50";
const labelClass = "mb-1.5 block font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500";

/** Composes the enquiry as a readable message for WhatsApp or email. */
function compose(f: Fields) {
  const lines = ["Namaste Silk Karagiri,", "", f.message.trim(), "", `— ${f.name.trim()}`, `Topic: ${f.topic}`];
  if (f.phone.trim()) lines.push(`Phone: ${f.phone.trim()}`);
  if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
  return lines.join("\n");
}

/**
 * Enquiry form. There is no backend yet, so submitting validates the fields and opens WhatsApp
 * with the message pre-filled (email is offered as an alternative). Swap `handleSubmit` for an
 * API call when a form endpoint exists.
 */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (!fields.name.trim()) er.name = "Please tell us your name.";
    if (!fields.phone.trim() && !fields.email.trim()) er.phone = "Add a phone number or an email so we can reply.";
    if (fields.email.trim() && !/^\S+@\S+\.\S+$/.test(fields.email.trim())) er.email = "That email doesn't look right.";
    if (fields.phone.trim() && fields.phone.replace(/\D/g, "").length < 10) er.phone = "Please enter a 10-digit mobile number.";
    if (fields.message.trim().length < 10) er.message = "A few more words, please — at least 10 characters.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(compose(fields))}`, "_blank", "noopener");
    setSent(true);
  };

  const mailto = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(`${fields.topic} — ${fields.name || "Website enquiry"}`)}&body=${encodeURIComponent(compose(fields))}`;

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center px-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9f2d55]/10 text-[#9f2d55]">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-heading-sub text-2xl text-ink-black">Dhanyavaad, {fields.name.split(" ")[0]}!</h3>
        <p className="mt-2 max-w-sm font-body text-[15px] leading-relaxed text-ink-black-300/80">
          Your message is ready in WhatsApp — just press send. {CONTACT_INFO.responseTime}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a href={mailto} className="inline-flex items-center gap-1.5 font-ui text-xs font-bold uppercase tracking-wider text-dark-teal hover:text-[#9f2d55]">
            <Mail className="h-3.5 w-3.5" /> Send by email instead
          </a>
          <button
            type="button"
            onClick={() => {
              setFields(EMPTY);
              setSent(false);
            }}
            className="font-ui text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-ink-black"
          >
            New message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Full name</label>
          <input id="cf-name" autoComplete="name" value={fields.name} onChange={set("name")} placeholder="Priya Sharma" className={inputClass} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 font-body text-xs text-[#9f2d55]">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>Mobile number</label>
          <input id="cf-phone" type="tel" inputMode="tel" autoComplete="tel" value={fields.phone} onChange={set("phone")} placeholder="+91 98xxx xxxxx" className={inputClass} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 font-body text-xs text-[#9f2d55]">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-email" className={labelClass}>Email address</label>
          <input id="cf-email" type="email" autoComplete="email" value={fields.email} onChange={set("email")} placeholder="you@example.com" className={inputClass} aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 font-body text-xs text-[#9f2d55]">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="cf-topic" className={labelClass}>I&apos;d like help with</label>
          <select id="cf-topic" value={fields.topic} onChange={set("topic")} className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>Message</label>
        <textarea id="cf-message" rows={5} value={fields.message} onChange={set("message")} placeholder="Tell us the saree, colour or occasion you have in mind…" className={`${inputClass} resize-none`} aria-invalid={!!errors.message} />
        {errors.message && <p className="mt-1 font-body text-xs text-[#9f2d55]">{errors.message}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <button
          type="submit"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-dark-teal px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-widest text-vanilla-custard shadow-md transition-[background-color,box-shadow] duration-300 hover:bg-[#9f2d55] hover:shadow-xl"
        >
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 translate-x-[-120%] bg-white/25 transition-transform duration-700 group-hover:translate-x-[420%]" />
          <span className="relative">Send message</span>
          <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="font-body text-xs italic text-stone-500">Opens WhatsApp with your message ready to send.</p>
      </div>
    </form>
  );
}

export default ContactForm;
