export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using RemindMe, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use RemindMe for personal, non-commercial transitory viewing only.
        </p>

        <h2>3. Service Description</h2>
        <p>
          RemindMe provides WhatsApp-based reminder services. We reserve the right to modify or discontinue the service at any time.
        </p>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
} 