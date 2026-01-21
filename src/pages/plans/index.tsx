import { DashboardLayout } from '@/components/DashboardLayout';
import { PlanCard } from '@/components/subscription/PlanCard';
import { UsageProgressBar } from '@/components/subscription/UsageProgressBar';
import { useSubscription } from '@/hooks/useSubscription';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Plans() {
  const { plans, activeSubscription, usageStatus, loading, subscribeToPlan } = useSubscription();

  const faqs = [
    {
      question: 'Como funciona a contagem de fotos?',
      answer: 'Cada imagem enviada para processamento de OCR conta como 1 foto. Arquivos PDF e Excel não contam para o limite de fotos.',
    },
    {
      question: 'O que acontece se eu atingir o limite?',
      answer: 'Nos planos Foto 60, 100 e 150, o OCR será bloqueado até que você faça upgrade. No plano Foto 200, você pode optar por pagar R$ 1,50 por foto excedente.',
    },
    {
      question: 'Posso fazer upgrade no meio do mês?',
      answer: 'Sim! Ao fazer upgrade, seu novo limite é aplicado imediatamente e o uso já realizado é mantido. O valor do novo plano será cobrado a partir da próxima mensalidade.',
    },
    {
      question: 'Como funciona o plano Básico?',
      answer: 'O plano Básico permite apenas importação de dados via Excel e PDF. Não inclui processamento de fotos com OCR.',
    },
    {
      question: 'As fotos excedentes são cobradas automaticamente?',
      answer: 'Não. No plano Foto 200, você precisa aceitar explicitamente a cobrança por fotos excedentes antes de continuar usando o OCR além do limite.',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Crown className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wide">Planos</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Escolha o plano ideal para você
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Todos os planos incluem acesso completo ao dashboard, relatórios e suporte. 
            A diferença está na quantidade de fotos processadas com OCR.
          </p>
        </div>

        {/* Current usage =
        {usageStatus && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Seu uso atual</CardTitle>
            </CardHeader>
            <CardContent>
              <UsageProgressBar usageStatus={usageStatus} />
            </CardContent>
          </Card>
        )}

        */}

        {/* Plans grid 
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        ) : (

        */}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.id === activeSubscription?.plan_id}
                isRecommended={plan.slug === 'foto-100'}
                onSelect={subscribeToPlan}
                loading={loading}
              />
            ))}
          </div>
      

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
