"use client"

import {useCallback, useMemo, useSyncExternalStore} from "react"
import {getProductById} from "@/lib/data"
import {
  CART_STORAGE_KEY,
  type CartItem,
  sanitizeCartItems,
} from "@/modules/commerce/cart"

const EMPTY_CART: CartItem[] = []
let cachedCartRaw: string | null | undefined
let cachedCartValue: CartItem[] = EMPTY_CART

function readCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (raw === cachedCartRaw) return cachedCartValue
    if (!raw) {
      cachedCartRaw = null
      cachedCartValue = EMPTY_CART
      return cachedCartValue
    }
    cachedCartRaw = raw
    cachedCartValue = sanitizeCartItems(JSON.parse(raw) as unknown)
    return cachedCartValue
  } catch {
    cachedCartRaw = null
    cachedCartValue = EMPTY_CART
    return cachedCartValue
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  const raw = JSON.stringify(items)
  cachedCartRaw = raw
  cachedCartValue = items
  window.localStorage.setItem(CART_STORAGE_KEY, raw)
}

function notifyCartChanged(itemCount: number) {
  if (typeof window === "undefined") return
  queueMicrotask(() => {
    window.dispatchEvent(
      new CustomEvent("cart:changed", {detail: {itemCount}}),
    )
  })
}

function subscribeToCart(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const onChange = () => callback()
  window.addEventListener("cart:changed", onChange as EventListener)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener("cart:changed", onChange as EventListener)
    window.removeEventListener("storage", onChange)
  }
}

export function useCartState() {
  const items = useSyncExternalStore(subscribeToCart, readCart, () => EMPTY_CART)

  const setAndPersist = useCallback(
    (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
      const current = readCart()
      const next = typeof updater === "function" ? updater(current) : updater
      writeCart(next)
      const itemCount = next.reduce((sum, item) => sum + item.quantity, 0)
      notifyCartChanged(itemCount)
    },
    [],
  )

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      if (!getProductById(productId)) return
      const safeQuantity = Math.max(1, Math.min(10, quantity))
      setAndPersist(prev => {
        const existing = prev.find(item => item.productId === productId)
        if (!existing) {
          return [...prev, {productId, quantity: safeQuantity}]
        }
        return prev.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(10, item.quantity + safeQuantity),
                ),
              }
            : item,
        )
      })
    },
    [setAndPersist],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQuantity = Math.max(1, Math.min(10, Math.round(quantity)))
      setAndPersist(prev =>
        prev.map(item =>
          item.productId === productId
            ? {...item, quantity: safeQuantity}
            : item,
        ),
      )
    },
    [setAndPersist],
  )

  const removeItem = useCallback(
    (productId: string) => {
      setAndPersist(prev => prev.filter(item => item.productId !== productId))
    },
    [setAndPersist],
  )

  const clearCart = useCallback(() => {
    setAndPersist([])
  }, [setAndPersist])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  return {
    items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
