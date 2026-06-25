"use client"
import { useEffect, useRef } from "react"

type Props = {
  orderNumber: string
}

export default function ConversionTracker({ orderNumber }: Props) {
  const fired = useRef(false)

  useEffect(() => {
    if (!orderNumber) return

    let cancelled = false
    let attempts = 0

    async function check() {
      if (cancelled || fired.current) return
      attempts++
      try {
        const res = await fetch("/api/order/" + encodeURIComponent(orderNumber))
        if (res.ok) {
          const data = await res.json()
          const order = data?.order
          if (order && order.status === "PAID") {
            if (!fired.current && typeof window.gtag === "function") {
              fired.current = true
              window.gtag("event", "conversion", {
                send_to: "AW-18266991654/lTLfCPyf9MQcEKbYsIZE",
                value: Number(order.total),
                currency: "COP",
                transaction_id: order.orderNumber,
              })
            }
            return
          }
        }
      } catch {}
      if (!cancelled && !fired.current && attempts < 4) {
        setTimeout(check, 2500)
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [orderNumber])

  return null
}
