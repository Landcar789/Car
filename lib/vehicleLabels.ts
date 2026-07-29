type VehicleTranslations = {
  fuelValues: Record<string, string>
  transValues: Record<string, string>
}

export function translateFuel(t: VehicleTranslations, value: string | null): string | null {
  if (!value) return value
  return t.fuelValues[value] ?? value
}

export function translateTrans(t: VehicleTranslations, value: string | null): string | null {
  if (!value) return value
  return t.transValues[value] ?? value
}