"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { sendMessage, type ContactState } from "./api/actions";

const initialState: ContactState = { status: "idle", message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20";

const labelClass = "mb-2 block text-sm font-medium text-slate-700";

const ContactForm = () => {
  const [state, action, isPending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Juan Dela Cruz"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="reach" className={labelClass}>
            Email or phone
          </label>
          <input
            id="reach"
            name="reach"
            type="text"
            required
            placeholder="09XX XXX XXXX"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option>Document request</option>
            <option>Complaint or concern</option>
            <option>Suggestion</option>
            <option>Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            minLength={10}
            placeholder="How can we help you?"
            className={`${fieldClass} resize-none`}
          />
        </div>
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-5 text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#B8860B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Sending..." : "Send message"}
        <Send
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </button>
    </form>
  );
};

export default ContactForm;
