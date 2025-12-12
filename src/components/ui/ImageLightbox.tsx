'use client';

import React, { useEffect, useState } from 'react';

interface ImageLightboxProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsZoomed(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div className="absolute top-4 right-4 z-[101]">
                <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div
                className={`relative transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                />
                <p className="absolute -bottom-12 left-0 right-0 text-center text-white/80 text-sm font-medium">
                    {alt}
                </p>
            </div>
        </div>
    );
}
