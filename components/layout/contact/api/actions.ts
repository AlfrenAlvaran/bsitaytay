"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const reach = String(formData.get("reach") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !reach || !subject || message.length < 10) {
    return {
      status: "error",
      message:
        "Please complete all fields. Your message should be at least 10 characters.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you. Your message was received and our staff will get back to you.",
  };
}
