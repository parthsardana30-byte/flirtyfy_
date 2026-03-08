import Header from '@/components/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="font-display text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-8 text-zinc-300 bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
          <p className="text-sm text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Flirtyfy (&quot;the App&quot;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. User Eligibility</h2>
            <p>
              You must be at least 18 years old to use the App. By registering, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Premium Subscriptions</h2>
            <p>
              We offer premium subscription plans (&quot;Premium&quot;) that unlock additional features. By subscribing, you agree to pay the recurring subscription fees. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p>
              You agree not to use the App for any unlawful purpose or in any way that violates these Terms. You are solely responsible for your interactions with the AI characters and must not generate or share content that is illegal, abusive, or harmful.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software, are the exclusive property of Flirtyfy and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              Flirtyfy and its AI characters provide simulated conversations for entertainment purposes only. We are not liable for any emotional, psychological, or financial damages resulting from your use of the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@flirtyfy.com" className="text-amber-400 hover:underline">support@flirtyfy.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
