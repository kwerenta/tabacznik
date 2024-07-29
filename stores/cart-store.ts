import type { Product, ProductImage } from "@/lib/db/schema"
import { persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"

export type CartProduct = Pick<Product, "id" | "name" | "slug" | "price"> & {
  imageUrl: ProductImage["url"] | null
  quantity: number
}

export type CartState = {
  products: CartProduct[]
}

export type CartActions = {
  addProduct: (product: CartProduct) => void
}

export type CartStore = CartState & CartActions

export const initCartStore = (): CartState => {
  return { products: [] }
}

export const defaultInitState: CartState = {
  products: [],
}

function addProductToCart(state: CartStore, newProduct: CartProduct) {
  const existingProduct = state.products.findIndex(
    ({ id }) => id === newProduct.id,
  )

  const newProducts =
    existingProduct !== -1
      ? state.products.map((product) =>
          product.id === newProduct.id
            ? { ...product, quantity: product.quantity + newProduct.quantity }
            : product,
        )
      : [...state.products, newProduct]

  return {
    products: newProducts,
  }
}

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set) => ({
        ...initState,
        addProduct: (product) =>
          set((state) => addProductToCart(state, product)),
      }),
      {
        name: "cart",
      },
    ),
  )
}
