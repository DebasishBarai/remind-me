export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including your name, email address, and phone number for WhatsApp notifications.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, including sending WhatsApp reminders.
        </p>

        <h2>3. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.
        </p>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
} 