'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/server/actions/stripe';
import { useState } from 'react';

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean | null;
  trialStart: Date | null;
  trialEnd: Date | null;
}

interface BillingSectionProps {
  subscription: Subscription | null;
  userId: string;
  labels: {
    subscription: string;
    manageSubscription: string;
    noActiveSubscriptionDescription: string;
    viewPlans: string;
    status: string;
    currentPlan: string;
    active: string;
    canceled: string;
    pastDue: string;
    incomplete: string;
    incompleteExpired: string;
    trialing: string;
    unpaid: string;
  };
}

export function BillingSection({ subscription, userId, labels }: BillingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const { url } = await createCustomerPortalSession({
        userId: userId,
        returnUrl: `${window.location.origin}/settings`,
      });

      window.location.href = url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{labels.subscription}</CardTitle>
          <CardDescription>
            {labels.noActiveSubscriptionDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/pricing'}>
            {labels.viewPlans}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'past_due':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return labels.active;
      case 'canceled':
        return labels.canceled;
      case 'past_due':
        return labels.pastDue;
      case 'incomplete':
        return labels.incomplete;
      case 'incomplete_expired':
        return labels.incompleteExpired;
      case 'trialing':
        return labels.trialing;
      case 'unpaid':
        return labels.unpaid;
      default:
        return status;
    }
  };

  const isTrial = subscription.trialStart && subscription.trialEnd && new Date() < new Date(subscription.trialEnd);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.subscription}</CardTitle>
        <CardDescription>
          {labels.manageSubscription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">{labels.status}:</span>
          <span className={`font-semibold ${getStatusColor(subscription.status)}`}>
            {getStatusText(subscription.status)}
          </span>
        </div>

        {isTrial && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Trial ends:</span>
            <span>{formatDate(subscription.trialEnd!)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="font-medium">{labels.currentPlan}:</span>
          <span>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
        </div>

        {subscription.cancelAtPeriodEnd === true && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              Your subscription will be canceled at the end of the current period.
            </p>
          </div>
        )}

        <Button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Loading...' : labels.manageSubscription}
        </Button>
      </CardContent>
    </Card>
  );
}
