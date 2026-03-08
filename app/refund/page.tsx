import Header from '@/components/Header';

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="font-display text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
        
        <div className="space-y-8 text-zinc-300 bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
          <p className="text-sm text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Cancellation Policy</h2>
            <p>
              You can cancel your Flirtyfy Premium subscription at any time. Your cancellation will take effect at the end of the current billing cycle. You will continue to have access to Premium features until your subscription expires.
            </p>
            <p className="mt-4">
              To cancel your subscription, please navigate to your Account Settings and select &quot;Manage Subscription,&quot; or contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Refund Policy</h2>
            <p>
              We offer a 7-day money-back guarantee for first-time subscribers. If you are not satisfied with your Premium experience within the first 7 days of your initial purchase, you may request a full refund.
            </p>
            <p className="mt-4">
              After the initial 7-day period, all subscription fees are non-refundable. We do not provide refunds or credits for any partial-month subscription periods or unused services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Exceptions</h2>
            <p>
              Refunds may be granted outside the 7-day window solely at our discretion in cases of:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Billing errors or duplicate charges.</li>
              <li>Extended service outages preventing access to Premium features.</li>
              <li>Unauthorized purchases made due to account compromise.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Shipping and Delivery Policy</h2>
            <p>
              Flirtyfy is a digital service. Therefore, no physical goods are shipped or delivered. All services and features are activated digitally upon successful payment. Shipping and delivery policies are not applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. How to Request a Refund</h2>
            <p>
              To request a refund within the eligible period, please contact our support team at <a href="mailto:support@flirtyfy.com" className="text-amber-400 hover:underline">support@flirtyfy.com</a> with your account details and the reason for your request. We aim to process all eligible refunds within 5-10 business days.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
