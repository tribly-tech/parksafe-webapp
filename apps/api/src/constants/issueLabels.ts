export const ISSUE_LABELS: Record<string, string> = {
  BLOCKING_VEHICLE: 'Blocking vehicle',
  WRONG_PARKING: 'Wrong parking',
  LIGHTS_ON: 'Lights on',
  DOOR_OPEN: 'Door open',
  FLAT_TYRE: 'Flat tyre',
  FLUID_LEAKING: 'Fluid leaking',
  VEHICLE_DAMAGE: 'Vehicle damage',
  EMERGENCY: 'Emergency',
}

export function issueLabel(issueType: string): string {
  return ISSUE_LABELS[issueType] ?? issueType
}
