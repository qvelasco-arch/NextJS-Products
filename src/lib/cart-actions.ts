"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCart,
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "./api";

const ProductIdSchema = z.string().min(1).max(100)
const QuantitySchema = z.number().int().min(1).max(99)

const CART_COOKIE = "cart_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

async function getOrCreateToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let token: string | null | undefined = cookieStore.get(CART_COOKIE)?.value;

  if (!token) {
    token = await createCart();
    if (token) {
      cookieStore.set(CART_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }
  }

  return token ?? null;
}

export async function addToCart(productId: string, quantity: number) {
  try {
    if (!ProductIdSchema.safeParse(productId).success || !QuantitySchema.safeParse(quantity).success) {
      return { success: false, error: "Invalid input" };
    }

    const token = await getOrCreateToken();
    if (!token) return { success: false, error: "Could not create cart" };

    const existing = await fetchCart(token);
    const alreadyInCart = existing?.items.some((i) => i.productId === productId);

    const cart = alreadyInCart
      ? await updateCartItem(token, productId, quantity)
      : await addCartItem(token, productId, quantity);
    if (!cart) return { success: false, error: "Failed to add item" };

    revalidatePath("/cart");
    return { success: true, cart };
  } catch {
    return { success: false, error: "An error occurred" };
  }
}

export async function updateQuantity(productId: string, quantity: number) {
  try {
    if (!ProductIdSchema.safeParse(productId).success || !QuantitySchema.safeParse(quantity).success) {
      return { success: false, error: "Invalid input" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(CART_COOKIE)?.value;
    if (!token) return { success: false, error: "No cart found" };

    const cart = await updateCartItem(token, productId, quantity);
    if (!cart) return { success: false, error: "Failed to update item" };

    return { success: true, cart };
  } catch {
    return { success: false, error: "An error occurred" };
  }
}

export async function removeFromCart(productId: string) {
  try {
    if (!ProductIdSchema.safeParse(productId).success) {
      return { success: false, error: "Invalid input" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(CART_COOKIE)?.value;
    if (!token) return { success: false, error: "No cart found" };

    const cart = await removeCartItem(token, productId);
    if (!cart) return { success: false, error: "Failed to remove item" };

    return { success: true, cart };
  } catch {
    return { success: false, error: "An error occurred" };
  }
}

export async function getCartToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
}
