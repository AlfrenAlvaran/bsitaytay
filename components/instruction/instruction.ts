export type InstructionItem = {
  step: string;
  title: string;
  description: string;
};

export const instructions: InstructionItem[] = [
  {
    step: "01",
    title: "Create an account",
    description:
      "Register using your personal information and a valid email address. Verify your account to securely access the document request system.",
  },
  {
    step: "02",
    title: "Submit a document request",
    description:
      "Select the document you need, provide the required information, and upload any supporting documents when necessary.",
  },
  {
    step: "03",
    title: "Review your request",
    description:
      "Check the details of your request carefully before submitting. Make sure all information and uploaded documents are complete and accurate.",
  },
  {
    step: "04",
    title: "Pay online",
    description:
      "Choose an available online payment method and complete the required payment. Keep your payment confirmation for reference.",
  },
  {
    step: "05",
    title: "Track your request",
    description:
      "Monitor the status of your request through your account. You can check whether it is being processed, approved, ready for release, or completed.",
  },
];
