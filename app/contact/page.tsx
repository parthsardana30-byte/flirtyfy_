import Header from '@/components/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="font-display text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="space-y-8 text-zinc-300">
          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
            <p className="mb-6">
              Have questions, feedback, or need support? We&apos;re here to help! Reach out to us using the contact details below.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">Email Support</h3>
                <p className="text-amber-400">support@flirtyfy.com</p>
                <p className="text-sm text-zinc-500 mt-1">We aim to respond to all inquiries within 24-48 hours.</p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium text-white">Business Inquiries</h3>
                <p className="text-amber-400">business@flirtyfy.com</p>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Operating Address</h2>
            <p className="mb-2">Flirtyfy Inc.</p>
            <p>123 AI Innovation Drive</p>
            <p>Tech District, San Francisco, CA 94105</p>
            <p>United States</p>
          </section>
        </div>
      </main>
    </div>
  );
}
