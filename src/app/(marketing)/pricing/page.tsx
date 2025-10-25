import { getProducts } from '@/server/actions/stripe';
import { PricingCard } from '@/components/PricingCard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PricingPage() {
  const products = await getProducts();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your needs. All plans include our core features with different limits and benefits.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product, index) => (
          <PricingCard 
            key={product.id} 
            product={product} 
            isPopular={index === 1} // Make the second product popular
            userId={user?.id}
          />
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-left">
            <h3 className="font-semibold">Can I change my plan anytime?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes, we offer a 14-day free trial for all paid plans. No credit card required.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, debit cards, and bank transfers through Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
