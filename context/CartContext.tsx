'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string; // unique combination of product id + options
    name: string;
    price: number;
    image: string;
    quantity: number;
    salePrice?: number;
    size?: string; // Added size
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isOpen: boolean; // For slide-over cart if we want it later
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: Omit<CartItem, 'id' | 'quantity'>) => {
        setItems((prevItems) => {
            // Generate ID based on name AND size
            const baseId = product.name.toLowerCase().replace(/\s+/g, '-');
            const sizeSuffix = product.size ? `-${product.size.toLowerCase()}` : '';
            const id = `${baseId}${sizeSuffix}`;

            const existingItem = prevItems.find((item) => item.id === id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, id, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => {
        setIsOpen((prev) => !prev);
    }

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const subtotal = items.reduce((total, item) => {
        const price = item.salePrice || item.price;
        return total + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                isOpen,
                toggleCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
