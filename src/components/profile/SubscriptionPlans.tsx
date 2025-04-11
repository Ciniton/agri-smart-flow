
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Leaf, ArrowRight } from 'lucide-react';

interface FeatureItem {
  text: string;
  included: boolean;
}

interface PlanProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: FeatureItem[];
  buttonText: string;
  recommended?: boolean;
  onSelect: () => void;
  badge?: string;
  icon: React.ReactNode;
  color: string;
}

const PlanCard: React.FC<PlanProps> = ({
  name,
  description,
  price,
  period,
  features,
  buttonText,
  recommended = false,
  onSelect,
  badge,
  icon,
  color
}) => {
  return (
    <Card className={`relative h-full transition-all duration-300 ${
      recommended ? 'border-primary shadow-lg scale-105 lg:scale-110 z-10' : 'hover:border-primary/50 hover:shadow-md'
    }`}>
      {badge && (
        <Badge className={`absolute top-0 right-0 -mt-2 -mr-2 ${color}`}>
          {badge}
        </Badge>
      )}
      <CardHeader className={`pb-3 ${recommended ? 'bg-primary/5 rounded-t-lg' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              {icon}
              {name}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">{period}</span>
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 border rounded-full border-muted-foreground/30 flex-shrink-0" />
              )}
              <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          onClick={onSelect} 
          className={`w-full gap-2 ${recommended ? color : ''}`}
          variant={recommended ? "default" : "outline"}
        >
          {buttonText}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionPlans: React.FC = () => {
  const handleSelectPlan = (plan: string) => {
    console.log(`Selected plan: ${plan}`);
    // Here you would typically handle the subscription logic
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Irrigation Plan</h2>
        <p className="text-muted-foreground">
          Select the plan that best fits your farm's irrigation needs. Upgrade or downgrade anytime.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <PlanCard
          name="Basic"
          description="Perfect for small farms and beginners"
          price="$19"
          period="/month"
          icon={<Leaf className="h-6 w-6 text-green-500" />}
          color="bg-green-100 text-green-800 hover:bg-green-200"
          features={[
            { text: "Up to 5 fields", included: true },
            { text: "3 irrigation zones per field", included: true },
            { text: "Basic weather forecasting", included: true },
            { text: "Email support", included: true },
            { text: "AI irrigation recommendations", included: false },
            { text: "Advanced soil analysis", included: false },
            { text: "API access", included: false },
          ]}
          buttonText="Select Basic Plan"
          onSelect={() => handleSelectPlan('basic')}
        />
        
        <PlanCard
          name="Pro"
          description="For professional growers and mid-sized farms"
          price="$49"
          period="/month"
          recommended={true}
          badge="Most Popular"
          icon={<Zap className="h-6 w-6 text-amber-500" />}
          color="bg-amber-100 text-amber-800 hover:bg-amber-200"
          features={[
            { text: "Up to 20 fields", included: true },
            { text: "Unlimited irrigation zones", included: true },
            { text: "Advanced weather forecasting", included: true },
            { text: "Priority email & phone support", included: true },
            { text: "AI irrigation recommendations", included: true },
            { text: "Basic soil analysis", included: true },
            { text: "API access", included: false },
          ]}
          buttonText="Select Pro Plan"
          onSelect={() => handleSelectPlan('pro')}
        />
        
        <PlanCard
          name="Enterprise"
          description="For large-scale agricultural operations"
          price="$99"
          period="/month"
          icon={<Crown className="h-6 w-6 text-purple-500" />}
          color="bg-purple-100 text-purple-800 hover:bg-purple-200"
          features={[
            { text: "Unlimited fields", included: true },
            { text: "Unlimited irrigation zones", included: true },
            { text: "Premium weather forecasting", included: true },
            { text: "24/7 dedicated support", included: true },
            { text: "Advanced AI recommendations", included: true },
            { text: "Comprehensive soil analysis", included: true },
            { text: "Full API access & custom integrations", included: true },
          ]}
          buttonText="Select Enterprise Plan"
          onSelect={() => handleSelectPlan('enterprise')}
        />
      </div>
      
      <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>All plans include a 14-day free trial. No credit card required to start. Prices are in USD and don't include applicable taxes. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
