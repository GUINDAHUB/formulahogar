"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogoSlider = () => {
    const [logos, setLogos] = useState<string[]>([]);

    useEffect(() => {
        // Auto-detect all images in /public/logos/
        // This fetches the directory listing (works with static exports)
        const loadLogos = async () => {
            try {
                // Try common image extensions
                const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
                const detectedLogos: string[] = [];

                // Check for images numbered 1-20 (adjust as needed)
                for (let i = 1; i <= 20; i++) {
                    for (const ext of extensions) {
                        const path = `/logos/logo${i}.${ext}`;
                        try {
                            const response = await fetch(path, { method: 'HEAD' });
                            if (response.ok) {
                                detectedLogos.push(path);
                                break; // Found this number, move to next
                            }
                        } catch {
                            // Image doesn't exist, continue
                        }
                    }
                }

                // Also check for any other common naming patterns
                const commonNames = ['partner', 'client', 'sponsor', 'brand'];
                for (const name of commonNames) {
                    for (let i = 1; i <= 10; i++) {
                        for (const ext of extensions) {
                            const path = `/logos/${name}${i}.${ext}`;
                            try {
                                const response = await fetch(path, { method: 'HEAD' });
                                if (response.ok && !detectedLogos.includes(path)) {
                                    detectedLogos.push(path);
                                    break;
                                }
                            } catch {
                                // Continue
                            }
                        }
                    }
                }

                setLogos(detectedLogos.length > 0 ? detectedLogos : [
                    '/logos/logo1.png',
                    '/logos/logo2.png',
                    '/logos/logo3.png',
                    '/logos/logo4.png'
                ]);
            } catch (error) {
                // Fallback to default paths
                setLogos([
                    '/logos/logo1.png',
                    '/logos/logo2.png',
                    '/logos/logo3.png',
                    '/logos/logo4.png'
                ]);
            }
        };

        loadLogos();
    }, []);

    if (logos.length === 0) return null;

    // Triplicate the logos array to create perfectly seamless infinite scroll
    const triplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="relative overflow-hidden w-full">
            <div className="flex">
                <motion.div
                    className="flex gap-12 md:gap-16 items-center"
                    animate={{
                        x: ['0%', '-33.333%'],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: logos.length * 3,
                            ease: "linear",
                        },
                    }}
                >
                    {triplicatedLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
                        >
                            <img
                                src={logo}
                                alt={`Logo ${(index % logos.length) + 1}`}
                                className="h-12 w-auto object-contain max-w-[150px]"
                                onError={(e) => {
                                    // Hide broken images
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LogoSlider;
