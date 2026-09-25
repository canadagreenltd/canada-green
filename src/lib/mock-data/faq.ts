export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export const homeFaqs: FaqItem[] = [
  {
    question: "What is Canada Green?",
    answer:
      "Canada Green is a crowdfunding platform that connects everyday Canadians with vetted investment opportunities in EV charging infrastructure and agricultural development across Canada.",
  },
  {
    question: "What is the minimum investment?",
    answer:
      "Minimum investments vary by project, typically starting from CAD $250–$1,000. Each project page lists its specific minimum clearly before you commit.",
  },
  {
    question: "Are returns guaranteed?",
    answer:
      "No. Expected returns are projections based on project models and are not guarantees. All investments carry risk, including the potential loss of capital. Please read each project's risk disclosure carefully.",
  },
  {
    question: "Who can invest?",
    answer:
      "Eligibility depends on your province of residence and applicable securities regulations. Some offerings may be limited to accredited investors or residents of certain jurisdictions. Account verification confirms what you can access.",
  },
  {
    question: "How do I get paid returns?",
    answer:
      "Return structures vary by project — some distribute periodically, others at maturity. Payment schedules and methods are detailed in each project's financials and offering documents.",
  },
  {
    question: "Is my investment secure?",
    answer:
      "We use industry-standard security practices and work with carefully vetted project sponsors. However, no investment is risk-free. Diversification and thorough review of disclosures remain your responsibility.",
  },
];

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      ...homeFaqs.slice(0, 2),
      {
        question: "How is Canada Green different from other crowdfunding sites?",
        answer:
          "We focus exclusively on two Canadian sectors — EV charging and agriculture — with curated, vetted projects and transparent progress reporting. Our platform is built for clarity and Canadian regulatory context.",
      },
      {
        question: "Where does Canada Green operate?",
        answer:
          "We list projects across Canada. Investor eligibility may vary by province. Always confirm residency requirements on the project page and during account setup.",
      },
    ],
  },
  {
    id: "investing",
    label: "Investing",
    items: [
      homeFaqs[2],
      homeFaqs[3],
      {
        question: "Can I invest in multiple projects?",
        answer:
          "Yes. You can diversify across EV and agriculture projects subject to each offering's eligibility rules and your available capital.",
      },
      {
        question: "What is the typical investment term?",
        answer:
          "Terms commonly range from 4 to 10 years depending on the asset. Shorter and longer opportunities may appear; check each project's details.",
      },
      {
        question: "Can I withdraw early?",
        answer:
          "Most offerings are illiquid until maturity or a defined exit event. Early exit options, if any, are described in the offering documents and are not guaranteed.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    items: [
      homeFaqs[4],
      {
        question: "How do I submit payment?",
        answer:
          "After reserving an investment, you will receive payment instructions. You can upload a payment receipt through your dashboard for admin review and approval.",
      },
      {
        question: "What currencies are accepted?",
        answer:
          "Investments are denominated in Canadian dollars (CAD). Payment methods accepted for each raise are listed during the invest flow.",
      },
      {
        question: "When will my investment show as confirmed?",
        answer:
          "Once your payment receipt is reviewed and approved by our team, your investment status updates in your dashboard. Timing depends on verification volume.",
      },
    ],
  },
  {
    id: "security",
    label: "Account & Security",
    items: [
      homeFaqs[5],
      {
        question: "How do you protect my personal information?",
        answer:
          "We apply industry-standard encryption and access controls. We only collect information needed to operate the platform and meet regulatory obligations.",
      },
      {
        question: "What if I forget my password?",
        answer:
          "Use the Forgot Password link on the login page to receive a secure reset email. Never share your credentials with anyone claiming to be Canada Green support.",
      },
      {
        question: "How do I update my profile or banking details?",
        answer:
          "Sign in to your dashboard and visit Profile. Sensitive changes may require re-verification for your protection.",
      },
    ],
  },
];
