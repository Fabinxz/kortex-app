'use client'

import { SimuladoEntryModal } from './simulado-entry-modal'
import { EssayEntryModal } from './essay-entry-modal'

export function ModalsTrigger() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
       <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg shadow-2xl flex flex-col gap-2">
          <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1 text-center">Entrada de Dados</p>
          <SimuladoEntryModal />
          <EssayEntryModal />
       </div>
    </div>
  )
}
