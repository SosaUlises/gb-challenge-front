export const quarters = [
  {
    id: 'Q1',
    label: 'Plan comercial',
    range: '1-4',
    start: 1,
    end: 4,
  },
  {
    id: 'Q2',
    label: 'Importación y stock',
    range: '5-8',
    start: 5,
    end: 8,
  },
  {
    id: 'Q3',
    label: 'Temporada alta',
    range: '9-12',
    start: 9,
    end: 12,
  },
  {
    id: 'Q4',
    label: 'Cierre y expansión',
    range: '13-15',
    start: 13,
    end: 15,
  },
] as const

export function getQuarter(currentScenario: number) {
  return (
    quarters.find(
      (quarter) =>
        currentScenario >= quarter.start && currentScenario <= quarter.end
    ) ?? quarters[0]
  )
}
