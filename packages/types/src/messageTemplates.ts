/**
 * packages/types/src/messageTemplates.ts
 * Issue categories → owner notification message templates.
 *
 * These are the ONLY messages dispatched through the relay.
 * No reporter identity or raw contact info is ever included.
 * Custom notes are appended after profanity filtering.
 */

import { IssueType } from './enums/issueType'

export const MESSAGE_TEMPLATES: Record<IssueType, string> = {
  [IssueType.BLOCKING_VEHICLE]:
    'Hi! Someone nearby needs to reach you — your vehicle appears to be blocking another vehicle. Please move it at your earliest convenience. This message is sent anonymously via ParkSafe.',

  [IssueType.WRONG_PARKING]:
    'Hi! Your vehicle is parked in a reserved/assigned spot. Could you please move it? Sent anonymously via ParkSafe.',

  [IssueType.LIGHTS_ON]:
    "Hi! Just a heads-up — your vehicle's headlights have been left on. You may want to check to avoid a dead battery. Sent via ParkSafe.",

  [IssueType.DOOR_OPEN]:
    'Hi! It looks like a door or window on your vehicle has been left open. Please check it when you can. Sent via ParkSafe.',

  [IssueType.FLAT_TYRE]:
    "Hi! One of your vehicle's tyres appears to be flat. You may want to check before driving. Sent anonymously via ParkSafe.",

  [IssueType.FLUID_LEAKING]:
    'Hi! There appears to be fluid leaking from your vehicle. Please check it as soon as possible. Sent via ParkSafe.',

  [IssueType.VEHICLE_DAMAGE]:
    'Hi! Your vehicle may have been involved in an incident and shows possible damage. Please check it. Sent anonymously via ParkSafe.',

  [IssueType.EMERGENCY]:
    'URGENT: Someone has flagged an emergency situation involving your vehicle. Please respond immediately. Sent via ParkSafe.',
}
