export const quarters = [
  {
    id: 'Q1',
    label: 'Plan comercial',
    range: '1-3',
    start: 1,
    end: 3,
  },
  {
    id: 'Q2',
    label: 'Importacion y stock',
    range: '4-6',
    start: 4,
    end: 6,
  },
  {
    id: 'Q3',
    label: 'Canales y equipos',
    range: '7-9',
    start: 7,
    end: 9,
  },
  {
    id: 'Q4',
    label: 'Cierre y expansion',
    range: '10-12',
    start: 10,
    end: 12,
  },
] as const

export const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export function getMonthName(month: number) {
  return monthNames[month - 1] ?? `Mes ${month}`
}

export function getQuarter(currentScenario: number) {
  return (
    quarters.find(
      (quarter) =>
        currentScenario >= quarter.start && currentScenario <= quarter.end
    ) ?? quarters[0]
  )
}
