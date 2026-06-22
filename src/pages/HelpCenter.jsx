import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import csvUploadGuide from "../assets/help/csv-upload-guide.webp";
import goalsGuide from "../assets/help/goals-guide.webp";
import insightsGuide from "../assets/help/insights-guide.webp";
import manualEntryGuide from "../assets/help/manual-entry-guide.webp";
import profileGuide from "../assets/help/profile-guide.webp";
import settingsPreferencesGuide from "../assets/help/settings-preferences-guide.webp";
import transactionsGuide from "../assets/help/transactions-guide.webp";

const guides = [
  {
    title: "How to Upload a CSV File",
    description: "Import your bank or finance data from a CSV file.",
    steps: [
      "Open Settings from the sidebar.",
      "Find the Data Source section.",
      "Click the Upload CSV File card.",
      "Choose whether to Replace existing data or Append new data.",
      "Review the imported transactions on the dashboard.",
    ],
    visualTitle: "Annotated CSV upload walkthrough",
    image: csvUploadGuide,
    imageAlt:
      "Annotated FinBoard settings screenshot showing the Data Source section, Replace and Append toggle, Upload CSV File card, and Load Demo Data button.",
  },
  {
    title: "How Demo Data Works",
    description: "Use sample data to explore FinBoard without uploading your own file.",
    steps: [
      "Open Settings.",
      "Go to the Data Source section.",
      "Click Load Demo Data.",
      "Explore Dashboard, Budgets, Goals, and Insights using sample transactions.",
    ],
    visualTitle: "Annotated demo data walkthrough",
    image: csvUploadGuide,
    imageAlt:
      "Annotated FinBoard settings screenshot highlighting the Load Demo Data button and the data source workflow.",
  },
  {
    title: "How to Add Transactions Manually",
    description: "Create income or expense entries one by one.",
    steps: [
      "Open Settings.",
      "Find the Manual Entry section.",
      "Select the transaction date and category.",
      "Enter a description if needed.",
      "Choose Income or Expense.",
      "Enter the amount and click Add Transaction.",
    ],
    visualTitle: "Annotated manual transaction entry walkthrough",
    image: manualEntryGuide,
    imageAlt:
      "Annotated FinBoard manual entry screenshot showing the date field, category dropdown, description field, income and expense selector, amount field, and Add Transaction button.",
  },
  {
    title: "Understanding Income vs Expense",
    description: "Know how FinBoard separates money coming in and going out.",
    steps: [
      "Use Income for salary, freelance earnings, refunds, or deposits.",
      "Use Expense for shopping, bills, food, travel, and subscriptions.",
      "Review the profile summary and dashboard charts to compare income and spending.",
    ],
    visualTitle: "Annotated income and expense summary",
    image: profileGuide,
    imageAlt:
      "Annotated FinBoard profile screenshot highlighting Total Income, Total Expenses, Total Savings, Transactions, Budgets Created, and Goals Created cards.",
  },
  {
    title: "How Transactions Work",
    description: "View and manage your recorded income and expense history.",
    steps: [
      "Open Transactions from the sidebar.",
      "Review all recorded transactions in one place.",
      "If no data is available, use Configure Settings to upload data or add entries manually.",
      "Once data is available, use this page to review your spending and income history.",
    ],
    visualTitle: "Annotated transactions page walkthrough",
    image: transactionsGuide,
    imageAlt:
      "Annotated FinBoard transactions screenshot showing the Transactions sidebar link, empty transaction history area, Configure Settings button, and transaction workflow notes.",
  },
  {
    title: "How Goals Work",
    description: "Track financial goals such as savings, travel, or emergency funds.",
    steps: [
      "Open Goals.",
      "Click New Goal to create a savings target.",
      "Add a goal name, target amount, and deadline.",
      "Track total savings and monthly savings progress.",
      "Update your goal as you save more.",
    ],
    visualTitle: "Annotated goal management walkthrough",
    image: goalsGuide,
    imageAlt:
      "Annotated FinBoard goals screenshot highlighting the New Goal button, total savings, average monthly savings, and goals list area.",
  },
  {
    title: "Understanding Insights",
    description: "Use analytics to understand spending trends and financial patterns.",
    steps: [
      "Open Insights.",
      "Review spending charts and summaries when transaction data is available.",
      "If insights are empty, configure your data source from Settings.",
      "Use observations to make better financial decisions.",
    ],
    visualTitle: "Annotated insights dashboard walkthrough",
    image: insightsGuide,
    imageAlt:
      "Annotated FinBoard insights screenshot showing the Insights section, empty analytics state, Configure Settings button, and explanation of how insights are generated.",
  },
  {
    title: "Managing Profile & Settings",
    description: "Manage profile summary, preferences, theme, and notification settings.",
    steps: [
      "Open Profile to review your financial summary.",
      "Open Preferences to adjust theme and notification settings.",
      "Use Settings to manage data source, CSV upload, demo data, and manual entries.",
      "Review these sections regularly to keep FinBoard personalized and up to date.",
    ],
    visualTitle: "Annotated profile and preferences walkthrough",
    image: settingsPreferencesGuide,
    secondaryImage: profileGuide,
    imageAlt:
      "Annotated FinBoard preferences screenshot showing theme selection and notification toggles.",
    secondaryImageAlt:
      "Annotated FinBoard profile screenshot showing financial summary cards and account overview.",
  },
];

function AnnotatedGuide({ title, image, imageAlt, secondaryImage, secondaryImageAlt }) {
  return (
    <div
      className="mt-5 rounded-2xl border p-4 overflow-hidden"
      style={{
        borderColor: "var(--color-fin-border)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-fin-accent) 8%, transparent), transparent)",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-semibold text-[var(--color-fin-text)]">{title}</p>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-fin-muted)]">
          Annotated Screenshot
        </span>
      </div>

      <figure
        className="rounded-xl border overflow-hidden bg-black/20"
        style={{ borderColor: "var(--color-fin-border)" }}
      >
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </figure>

      {secondaryImage && (
        <figure
          className="mt-4 rounded-xl border overflow-hidden bg-black/20"
          style={{ borderColor: "var(--color-fin-border)" }}
        >
          <img
            src={secondaryImage}
            alt={secondaryImageAlt}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </figure>
      )}

      <p className="mt-3 text-xs text-[var(--color-fin-muted)]">
        The screenshot above uses arrows, outlines, labels, and numbered
        callouts to visually explain the related FinBoard workflow.
      </p>
    </div>
  );
}

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return guides;

    return guides.filter((guide) => {
      const searchableText = [
        guide.title,
        guide.description,
        guide.visualTitle,
        ...guide.steps,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery]);
  return (
    <main className="p-4 md:p-8 space-y-6">
      <section className="theme-card p-6 rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="text-[var(--color-fin-accent)]" />
              <h1 className="text-2xl font-bold text-[var(--color-fin-text)]">
                Help Center / User Guide
              </h1>
            </div>
            <p className="text-[var(--color-fin-muted)]">
              Learn how to use FinBoard with beginner-friendly guides, real
              annotated screenshots, highlighted UI elements, arrows, and
              step-by-step visual walkthroughs.
            </p>
          </div>

         <label
className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-[var(--color-fin-muted)]"  style={{ borderColor: "var(--color-fin-border)" }}
>
  <Search size={16} />
  <input
    type="search"
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    placeholder="Search Help Center guides..."
    aria-label="Search Help Center guides"
    className="w-full min-w-[220px] bg-transparent outline-none text-[var(--color-fin-text)] placeholder:text-[var(--color-fin-muted)]"
  />
</label>
        </div>
      </section>

      <section className="grid gap-4">
       {filteredGuides.length > 0 ? (
  filteredGuides.map((guide, index) => (
          <details
            key={guide.title}
            className="theme-card rounded-2xl p-5 group"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-[var(--color-fin-text)]">
              <span>
                {index + 1}. {guide.title}
              </span>
              <ChevronDown
                className="transition-transform group-open:rotate-180"
                size={18}
              />
            </summary>

            <p className="mt-3 text-sm text-[var(--color-fin-muted)]">
              {guide.description}
            </p>

            <ol className="mt-4 space-y-2 text-sm text-[var(--color-fin-muted)] list-decimal list-inside">
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <AnnotatedGuide
              title={guide.visualTitle}
              image={guide.image}
              imageAlt={guide.imageAlt}
              secondaryImage={guide.secondaryImage}
              secondaryImageAlt={guide.secondaryImageAlt}
            />
          </details>
         ))
) : (
  <div className="theme-card rounded-2xl p-6 text-center text-[var(--color-fin-muted)]">
    No results found for "{searchQuery}". Try searching for CSV, goals, insights, profile, or transactions.
  </div>
)}
      </section>
    </main>
  );
}
