import { IssueType } from '@parksafe/types'
import { en } from '@/content/en'

/** Display metadata for each issue type — labels, subtitles, and emoji per Figma. */
export const ISSUE_META: Record<
  IssueType,
  { emoji: string; label: string; description: string }
> = {
  [IssueType.BLOCKING_VEHICLE]: {
    emoji: '🚗',
    label: en.CONTACT_ISSUE_CARD_BLOCKING_LABEL,
    description: en.CONTACT_ISSUE_CARD_BLOCKING_DESC,
  },
  [IssueType.WRONG_PARKING]: {
    emoji: '🅿️',
    label: en.CONTACT_ISSUE_CARD_WRONG_PARKING_LABEL,
    description: en.CONTACT_ISSUE_CARD_WRONG_PARKING_DESC,
  },
  [IssueType.LIGHTS_ON]: {
    emoji: '💡',
    label: en.CONTACT_ISSUE_CARD_LIGHTS_ON_LABEL,
    description: en.CONTACT_ISSUE_CARD_LIGHTS_ON_DESC,
  },
  [IssueType.DOOR_OPEN]: {
    emoji: '⚠️',
    label: en.CONTACT_ISSUE_CARD_DOOR_OPEN_LABEL,
    description: en.CONTACT_ISSUE_CARD_DOOR_OPEN_DESC,
  },
  [IssueType.FLAT_TYRE]: {
    emoji: '🛞',
    label: en.CONTACT_ISSUE_CARD_FLAT_TYRE_LABEL,
    description: en.CONTACT_ISSUE_CARD_FLAT_TYRE_DESC,
  },
  [IssueType.FLUID_LEAKING]: {
    emoji: '💧',
    label: en.CONTACT_ISSUE_CARD_FLUID_LEAKING_LABEL,
    description: en.CONTACT_ISSUE_CARD_FLUID_LEAKING_DESC,
  },
  [IssueType.VEHICLE_DAMAGE]: {
    emoji: '💥',
    label: en.CONTACT_ISSUE_CARD_DAMAGE_LABEL,
    description: en.CONTACT_ISSUE_CARD_DAMAGE_DESC,
  },
  [IssueType.EMERGENCY]: {
    emoji: '⚠️',
    label: en.CONTACT_ISSUE_CARD_EMERGENCY_LABEL,
    description: en.CONTACT_ISSUE_CARD_EMERGENCY_DESC,
  },
}
