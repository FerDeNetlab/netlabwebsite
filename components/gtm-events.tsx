'use client'

import { useEffect } from 'react'
import { pushEvent } from '@/lib/gtm'

/**
 * Listener global de clics que empuja eventos al dataLayer de GTM sin tener
 * que editar cada botón del sitio. Captura, por delegación:
 *  - enlaces wa.me / api.whatsapp.com  -> click_whatsapp
 *  - enlaces tel:                       -> click_telefono
 *  - enlaces a cal.com (agendar/demo)   -> cta_demo
 * Montar una sola vez en el layout público.
 */
export function GtmEvents() {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            const anchor = target?.closest('a') as HTMLAnchorElement | null
            if (!anchor) return
            const href = anchor.getAttribute('href') || ''

            if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
                pushEvent('click_whatsapp', { link_url: href, link_text: anchor.textContent?.trim()?.slice(0, 80) })
            } else if (href.startsWith('tel:')) {
                pushEvent('click_telefono', { link_url: href })
            } else if (/cal\.com/i.test(href)) {
                pushEvent('cta_demo', { link_url: href, link_text: anchor.textContent?.trim()?.slice(0, 80) })
            }
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    return null
}
