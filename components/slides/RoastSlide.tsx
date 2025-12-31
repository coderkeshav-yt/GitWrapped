'use client'

import React, { useState, useEffect } from 'react';
import { SlideLayout } from '../SlideLayout';
import { GitWrappedData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { generateRoastAndToast } from '@/services/geminiService';

type Mode = 'roast' | 'toast';

export const RoastSlide: React.FC<{ data: GitWrappedData }> = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mode, setMode] = useState<Mode>('roast');
    const [isGenerating, setIsGenerating] = useState(false);
    const [roastText, setRoastText] = useState<string>('');
    const [toastText, setToastText] = useState<string>('');
    const [showText, setShowText] = useState(false);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // Load initial content
    useEffect(() => {
        console.log('RoastSlide mounted, roastData:', data.roastData);

        if (data.roastData) {
            console.log('Using provided roastData');
            setRoastText(data.roastData.roast);
            setToastText(data.roastData.toast);
            setIsUsingFallback(false);
            // Delay text reveal for animation
            setTimeout(() => setShowText(true), 500);
        } else {
            // Generate fallback content if roastData is missing
            console.log('No roastData found, generating new content');
            setIsGenerating(true);
            generateRoastAndToast(data)
                .then(newContent => {
                    console.log('Generated new content:', newContent);
                    setRoastText(newContent.roast);
                    setToastText(newContent.toast);
                    setIsUsingFallback(false);
                    setTimeout(() => {
                        setShowText(true);
                        setIsGenerating(false);
                    }, 500);
                })
                .catch(error => {
                    console.error('Failed to generate initial content:', error);
                    // Use hardcoded fallbacks as last resort
                    setRoastText(`${data.totalCommits} commits and still using ${data.topLanguages[0]?.name}? Bold choice! 😏`);
                    setToastText(`${data.totalCommits} commits of pure dedication! You're building something amazing! 🚀`);
                    setIsUsingFallback(true);
                    setShowText(true);
                    setIsGenerating(false);
                });
        }
    }, [data]);

    const handleRegenerate = async () => {
        setIsGenerating(true);
        setShowText(false);

        try {
            const newContent = await generateRoastAndToast(data);
            setRoastText(newContent.roast);
            setToastText(newContent.toast);
            setIsUsingFallback(false);

            // Delay to show loading animation
            setTimeout(() => {
                setShowText(true);
                setIsGenerating(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to regenerate:', error);
            setIsUsingFallback(true);
            setIsGenerating(false);
            setShowText(true);
        }
    };

    const currentText = mode === 'roast' ? roastText : toastText;
    const gradientStart = mode === 'roast' ? '#FF6B6B' : '#4ECDC4';
    const gradientEnd = mode === 'roast' ? '#C92A2A' : '#1A936F';

    return (
        <SlideLayout gradientStart={gradientStart} gradientEnd={gradientEnd}>
            <div className="flex-1 flex flex-col items-center justify-center h-full px-6 py-12">

                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{
                            rotate: mode === 'roast' ? [0, -10, 10, -10, 0] : [0, 5, -5, 5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-4"
                    >
                        {mode === 'roast' ? '🔥' : '🎉'}
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-2">
                        {mode === 'roast' ? 'The Roast' : 'The Toast'}
                    </h2>
                    <p className="text-white/60 text-sm font-mono uppercase tracking-widest">
                        AI-Powered {mode === 'roast' ? 'Reality Check' : 'Celebration'}
                    </p>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`w-full max-w-lg rounded-2xl p-8 backdrop-blur-xl border-2 relative overflow-hidden ${isDark
                        ? 'bg-white/10 border-white/20'
                        : 'bg-black/10 border-black/20'
                        }`}
                >
                    {/* Sparkle effect */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                    />

                    {/* Text Content */}
                    <div className="relative min-h-[200px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                    <p className="text-white/60 text-sm font-mono">Generating magic...</p>
                                </motion.div>
                            ) : showText ? (
                                <motion.p
                                    key={currentText}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-white text-xl md:text-2xl font-sans leading-relaxed text-center"
                                >
                                    "{currentText}"
                                </motion.p>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-white/40 text-center"
                                >
                                    <Sparkles className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm font-mono">Preparing your {mode}...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mode Toggle */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex gap-3"
                    >
                        <button
                            onClick={() => setMode('roast')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${mode === 'roast'
                                ? 'bg-white text-red-600 shadow-lg scale-105'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <Flame size={18} />
                            Roast
                        </button>
                        <button
                            onClick={() => setMode('toast')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${mode === 'toast'
                                ? 'bg-white text-teal-600 shadow-lg scale-105'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <Heart size={18} />
                            Toast
                        </button>
                    </motion.div>
                </motion.div>

                {/* Regenerate Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isDark
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : 'bg-black/20 text-white hover:bg-black/30 border border-white/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                    {isGenerating ? 'Generating...' : 'Regenerate'}
                </motion.button>
            </div>
        </SlideLayout>
    );
};
