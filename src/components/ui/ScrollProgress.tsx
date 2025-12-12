'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;

            setProgress(Number(scroll));
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer transition-all duration-100 ease-out"
                style={{ width: `${progress * 100}%` }}
            />
        </div>
    );
}
