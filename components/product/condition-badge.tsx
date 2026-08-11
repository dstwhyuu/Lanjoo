import { Badge } from '@/components/ui/badge'
import { CONDITION_LABELS, CONDITION_VARIANTS } from '@/lib/constants'
import type { ProductCondition } from '@/types'

interface ConditionBadgeProps {
  condition: ProductCondition
  className?: string
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge variant={CONDITION_VARIANTS[condition]} className={className}>
      {CONDITION_LABELS[condition]}
    </Badge>
  )
}
