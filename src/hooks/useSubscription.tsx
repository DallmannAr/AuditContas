import { useState, useEffect, useCallback } from 'react';
import { Plan, ActiveSubscription, UsageStatus } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

export function useSubscription() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  {/* Fetch plans
  const fetchPlans = useCallback(async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }

    setPlans(data || []);
  }, []);

  // Fetch active subscription
  const fetchActiveSubscription = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .rpc('get_active_subscription', { p_user_id: uid });

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    if (data && data.length > 0) {
      const sub = data[0] as ActiveSubscription;
      setActiveSubscription(sub);
      
      // Calculate usage status
      const percentage = sub.photo_limit > 0 
        ? Math.round((sub.photos_used / sub.photo_limit) * 100) 
        : 0;
      
      // Count overage photos
      const { count } = await supabase
        .from('photo_usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', sub.subscription_id)
        .eq('is_overage', true);



      setUsageStatus({
        photosUsed: sub.photos_used,
        photoLimit: sub.photo_limit,
        percentage,
        isNearLimit: sub.photo_limit > 0 && percentage >= 80,
        isAtLimit: sub.photo_limit > 0 && percentage >= 100,
        allowsOverage: sub.allows_overage,
        overageAccepted: sub.overage_accepted,
        overagePriceCents: sub.overage_price_cents,
        overagePhotosCount: count || 0,
      });

      return sub;
    }

    setActiveSubscription(null);
    setUsageStatus(null);
    return null;
  }, []);

          */}

  // Subscribe to a plan
  const subscribeToPlan = useCallback(async (planId: string) => {
    if (!userId) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para assinar um plano.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Cancel existing active subscription
      if (activeSubscription) {
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('id', activeSubscription.subscription_id);
      }

      // Create new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          photos_used: activeSubscription?.photos_used || 0, // Mantém uso ao fazer upgrade
        })
        .select()
        .single();

      if (error) throw error;

      // Create transaction record
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        await supabase.from('transactions').insert({
          user_id: userId,
          subscription_id: data.id,
          type: activeSubscription ? 'upgrade' : 'subscription',
          amount_cents: plan.price_cents,
          description: activeSubscription 
            ? `Upgrade para ${plan.name}`
            : `Assinatura ${plan.name}`,
          status: 'completed',
        });
      }

      toast({
        title: 'Sucesso!',
        description: activeSubscription 
          ? 'Seu plano foi atualizado com sucesso!'
          : 'Assinatura realizada com sucesso!',
      });

      await fetchActiveSubscription(userId);
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar sua assinatura.',
        variant: 'destructive',
      });
      return false;
    }
  }, [userId, activeSubscription, plans, toast, fetchActiveSubscription]);

  // Accept overage charges (only for Foto 200)
  const acceptOverage = useCallback(async () => {
    if (!activeSubscription || !usageStatus?.allowsOverage) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          overage_accepted: true,
          overage_accepted_at: new Date().toISOString(),
        })
        .eq('id', activeSubscription.subscription_id);

      if (error) throw error;

      toast({
        title: 'Excedente aceito',
        description: 'Você pode continuar usando o OCR. Fotos extras serão cobradas a R$ 1,50 cada.',
      });

      await fetchActiveSubscription(userId!);
      return true;
    } catch (error) {
      console.error('Error accepting overage:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar sua solicitação.',
        variant: 'destructive',
      });
      return false;
    }
  }, [activeSubscription, usageStatus, userId, toast, fetchActiveSubscription]);

  // Log photo usage
  const logPhotoUsage = useCallback(async (fileName?: string, fileSize?: number) => {
    if (!activeSubscription || !userId) {
      return { success: false, blocked: true, reason: 'no_subscription' };
    }

    const { photosUsed, photoLimit, allowsOverage, overageAccepted } = usageStatus!;
    const isOverLimit = photosUsed >= photoLimit;

    // Block if over limit and not allowed overage or hasn't accepted
    if (isOverLimit && !allowsOverage) {
      return { success: false, blocked: true, reason: 'limit_reached' };
    }

    if (isOverLimit && allowsOverage && !overageAccepted) {
      return { success: false, blocked: true, reason: 'overage_not_accepted' };
    }

    const isOverage = isOverLimit && allowsOverage && overageAccepted;

    try {
      // Log the usage
      await supabase.from('photo_usage_logs').insert({
        user_id: userId,
        subscription_id: activeSubscription.subscription_id,
        is_overage: isOverage,
        file_name: fileName,
        file_size: fileSize,
      });

      // Increment counter
      await supabase.rpc('increment_photo_usage', {
        p_subscription_id: activeSubscription.subscription_id,
        p_is_overage: isOverage,
      });

      // If overage, create transaction
      if (isOverage && usageStatus?.overagePriceCents) {
        await supabase.from('transactions').insert({
          user_id: userId,
          subscription_id: activeSubscription.subscription_id,
          type: 'overage',
          amount_cents: usageStatus.overagePriceCents,
          description: `Foto excedente - ${fileName || 'arquivo'}`,
          status: 'completed',
        });
      }

      await fetchActiveSubscription(userId);
      return { success: true, blocked: false, isOverage };
    } catch (error) {
      console.error('Error logging photo usage:', error);
      return { success: false, blocked: false, reason: 'error' };
    }
  }, [activeSubscription, userId, usageStatus, fetchActiveSubscription]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await Promise.all([
          fetchPlans(),
          fetchActiveSubscription(user.id),
        ]);
      } else {
        await fetchPlans();
      }
      
      setLoading(false);
    };

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await fetchActiveSubscription(session.user.id);
      } else {
        setUserId(null);
        setActiveSubscription(null);
        setUsageStatus(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchPlans, fetchActiveSubscription]);

  return {
    plans,
    activeSubscription,
    usageStatus,
    loading,
    subscribeToPlan,
    acceptOverage,
    logPhotoUsage,
    refresh: () => userId && fetchActiveSubscription(userId),
  };
}
