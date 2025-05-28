"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_FORM_REASONS, ROUTES } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { Loader2, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { submitContactForm } from "../actions";
import { contactFormSchema } from "../contact-form-schema";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null,
  );
  const { user } = useUser();
  const router = useRouter();
  const params = useSearchParams();
  const [reason, setReason] = useState<string>(params.get("reason") ?? "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("reason", reason);
    const data = Object.fromEntries(formData.entries());

    try {
      contactFormSchema.parse(data);
      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!state) return;

    if (!state.success) toast.error(state.message);
    if (state.success) {
      toast.success(state.message);

      const timeout = setTimeout(() => {
        router.push(ROUTES.dashboard.root);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state, router]);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-xl gap-4 md:grid-cols-2"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={user?.fullName ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.emailAddresses[0].emailAddress}
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="reason">Reason for Contact</Label>
        <Select name="reason" value={reason} onValueChange={setReason} required>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CONTACT_FORM_REASONS).map(({ key, value }) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          className="min-h-[150px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full md:col-span-2"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Send />}
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
