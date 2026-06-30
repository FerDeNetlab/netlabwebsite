// Helper para enviar eventos al dataLayer de Google Tag Manager (GTM-TW4NG9HK).
// GTM ya está instalado en app/layout.tsx; aquí solo empujamos eventos.

type DataLayerEvent = Record<string, unknown> & { event: string }

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[]
    }
}

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
    if (typeof window === 'undefined') return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params } as DataLayerEvent)
}
