import { useEffect } from 'react'
import { getMonthName } from '../utils/gameProgress'

type SellCompanyModalProps = {
  month: number
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

function SellCompanyModal({
  month,
  isSubmitting,
  onCancel,
  onConfirm,
}: SellCompanyModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onCancel])

  return (
    <div className="result-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-md">
      <section
        className="result-modal-panel w-full max-w-xl rounded-2xl border border-red-200/25 bg-[linear-gradient(145deg,rgba(15,23,42,0.99),rgba(2,6,23,0.99))] shadow-2xl shadow-red-950/25"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-company-title"
      >
        <div className="border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-100">
            Decisión irreversible
          </p>
          <h2
            id="sell-company-title"
            className="mt-3 text-3xl font-black uppercase leading-none text-white sm:text-4xl"
          >
            Vender Grupo Blanco
          </h2>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <p className="text-base font-medium leading-7 text-slate-200">
            La gestión finalizará en {getMonthName(month)}. El puntaje se
            calculará con el estado actual de tus cinco indicadores y quedará
            registrado en el ranking global.
          </p>
          <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-200/[0.06] px-4 py-3 text-sm font-bold leading-6 text-amber-100">
            No podrás continuar con los meses restantes después de confirmar.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar gestionando
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-full border border-red-200/35 bg-red-200/10 px-5 py-3 text-sm font-black text-red-100 transition hover:border-red-100 hover:bg-red-200/20 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Procesando venta...' : 'Confirmar venta'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default SellCompanyModal
