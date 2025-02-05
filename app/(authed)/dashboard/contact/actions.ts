"use server";

import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  reason: z.string().min(1, "Reason is required"),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(_: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user)
    return {
      success: false,
      message: "Must be authenticated to use the contact form. Please sign in.",
    };

  const data = Object.fromEntries(formData.entries());
  const parsedData = contactFormSchema.safeParse(data);

  // Validate form data using Zod
  if (!parsedData.success) {
    return {
      success: false,
      message: parsedData.error.errors.map((err) => err.message).join(", "),
    };
  }

  const { name, email, reason, message } = parsedData.data;

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: "smtp.hostinger.com",
    auth: {
      user: process.env.HOSTINGER_CONTACT_EMAIL,
      pass: process.env.HOSTINGER_CONTACT_PASSWORD,
    },
  });

  // Send email
  try {
    await transporter.sendMail({
      from: `Table Topics <${process.env.HOSTINGER_CONTACT_EMAIL}>`,
      to: "wakehamretail+tabletopics@gmail.com",
      replyTo: email,
      subject: `Contact Form Submission from ${name} - ${reason}`,
      text: `
          Contact Form Submission
          UserID: ${user.id}
          Name: ${name}
          Email: ${email}
          Reason: ${reason}
          Message: ${message}
        `,
      html: `
          <h1>Contact Form Submission</h1>
          <p><strong>UserID:</strong> ${user.id}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
    });

    return {
      success: true,
      message: "Thank you for your message. We will get back to you soon.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "There was an error sending your message. Please try again later.",
    };
  }
}
