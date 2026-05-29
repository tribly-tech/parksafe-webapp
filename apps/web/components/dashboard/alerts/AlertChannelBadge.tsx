'use client'

import { MessageCircle, MessageSquare, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getAlertChannelKey } from '@/lib/utils/alertDisplay'
import { cn } from '@/lib/utils/cn'

const CHANNEL_LABEL_KEYS = {
  SMS: 'DASHBOARD_ALERT_CHANNEL_SMS',
  WHATSAPP: 'DASHBOARD_ALERT_CHANNEL_WHATSAPP',
  CALL: 'DASHBOARD_ALERT_CHANNEL_CALL',
  UNKNOWN: 'DASHBOARD_ALERT_CHANNEL_UNKNOWN',
} as const

const styles = {
  SMS: 'border-primary-500/20 bg-primary-50 text-primary-600',
  WHATSAPP: 'border-success-500/20 bg-success-50 text-success-500',
  CALL: 'border-warning-500/20 bg-warning-50 text-warning-500',
  UNKNOWN: 'border-neutral-200 bg-neutral-50 text-neutral-600',
} as const

const icons = {
  SMS: MessageSquare,
  WHATSAPP: MessageCircle,
  CALL: Phone,
  UNKNOWN: MessageSquare,
} as const

interface AlertChannelBadgeProps {
  channel: string
}

export function AlertChannelBadge({ channel }: AlertChannelBadgeProps) {
  const t = useTranslations()
  const channelKey = getAlertChannelKey(channel)
  const label = t(CHANNEL_LABEL_KEYS[channelKey])
  const Icon = icons[channelKey]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
        styles[channelKey]
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </span>
  )
}
