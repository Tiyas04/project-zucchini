export interface FAQItem {
  question: string;
  answer: string;
}
export interface FAQAccordionItemProps {
  item: FAQItem;
  isExpanded: boolean;
  onClick: () => void;
  index: number;
}
export const faqData: FAQItem[] = [
  {
    question: "Are there any registration fees for participating in NITRUTSAV Events?",
    answer:
      "Yes, a small registration fee is there. Check the event details on the website for specific information.",
  },
  {
    question: "Coming Soon...",
    answer: "Coming Soon...",
  },
  // {
  //   question: "Are there any registration fees for participating in NITRUTSAV Events?",
  //   answer:
  //     "Yes, a small registration fee is there. Check the event details on the website for specific information.",
  // },
  // {
  //   question: "Are there any registration fees for participating in NITRUTSAV Events?",
  //   answer:
  //     "Yes, a small registration fee is there. Check the event details on the website for specific information.",
  // },
  // {
  //   question: "Are there any registration fees for participating in NITRUTSAV Events?",
  //   answer:
  //     "Yes, a small registration fee is there. Check the event details on the website for specific information.",
  // },
  // {
  //   question: "Are there any registration fees for participating in NITRUTSAV Events?",
  //   answer:
  //     "Yes, a small registration fee is there. Check the event details on the website for specific information.",
  // },
];
