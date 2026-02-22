'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { X, Check } from 'lucide-react';

interface ToastData {
    id: string;
    name: string;
    price: number;
    size?: string;
    image?: string;
}

interface ToastContextType {
    showToast: (data: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Refs to manage timers and prevent race conditions
    const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
    const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (data: Omit<ToastData, 'id'>) => {
        // Clear any existing timers
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);

        const id = Date.now().toString();
        setToast({ ...data, id });

        // Process next tick to allow DOM to acknowledge state presence before animating in
        // If we were hidden/null, we want to ensure we start at translate-x-full
        if (!isVisible) {
            // Force a small delay if starting from hidden
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(true);
        }

        // Auto-dismiss after 3 seconds
        dismissTimerRef.current = setTimeout(() => {
            closeToast();
        }, 3000);
    };

    const closeToast = () => {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

        setIsVisible(false); // Trigger slide out

        // Wait for animation to finish before removing data
        cleanupTimerRef.current = setTimeout(() => {
            setToast(null);
        }, 500); // 500ms matches CSS duration
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Component */}
            <div
                className={`fixed top-24 right-0 z-50 transform transition-transform duration-500 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {toast && (
                    <div className="bg-white border-l-4 border-black shadow-2xl p-6 w-96 m-4 flex items-start gap-5 relative">
                        {toast.image && (
                            <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                                <img src={toast.image} alt={toast.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0 pr-6">
                            <h4 className="text-base font-medium text-gray-900 truncate pr-4">{toast.name}</h4>
                            <p className="text-sm text-black mt-1">Size: {toast.size || 'N/A'}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-base font-semibold text-black">₹{toast.price.toFixed(2)}</span>
                                <div className="flex items-center text-sm text-green-600 font-medium tracking-wide uppercase">
                                    <Check className="w-4 h-4 mr-1" />
                                    Added
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeToast}
                            className="text-gray-400 hover:text-black absolute top-6 right-6"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
