"use client";

import React from 'react';
import { motion } from 'framer-motion';

const LogoSlider = () => {
    // Static list of logos to avoid expensive runtime detection
    const logos = [
        '/logos/logo1.png',
        '/logos/logo2.jpg',
        '/logos/logo3.png',
        '/logos/logo4.png',
        '/logos/logo5.png'
    ];

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
