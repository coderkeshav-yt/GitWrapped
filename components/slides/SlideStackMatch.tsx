import React from 'react'
import { motion } from 'framer-motion'
import { StackMatch } from '../../types'
import { SlideLayout } from '../SlideLayout'
import { TextReveal } from '../TextReveal'
import { useTheme } from '@/context/ThemeContext'
import { Briefcase, CheckCircle2, TrendingUp } from 'lucide-react'

interface SlideStackMatchProps {
    data: StackMatch
}

export const SlideStackMatch: React.FC<SlideStackMatchProps> = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!data) return null;

    return (
        <SlideLayout gradientStart="#8B5CF6" gradientEnd="#3B82F6">
            <div className="flex-1 flex flex-col justify-center relative items-center text-center">

                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.1, scale: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hero-blue rounded-full blur-[100px]"
                    />
                </div>

                <div className="relative z-10 w-full max-w-2xl px-4">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center">
                        <TextReveal
                            text="The Career Match."
                            className={`text-xl font-mono mb-6 uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                        />

                        <div className="text-6xl mb-6">{data.icon}</div>

                        <TextReveal
                            text={data.role}
                            className={`text-5xl md:text-7xl font-serif leading-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}
                            delay={0.5}
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className={`text-lg font-sans max-w-lg mx-auto ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                        >
                            {data.description}
                        </motion.p>
                    </div>

                    {/* Stats / Score */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 2, type: "spring" }}
                        className="mb-12 inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-opacity-10 backdrop-blur-sm border-neutral-700 bg-neutral-800"
                    >
                        <Briefcase className="w-5 h-5 text-hero-blue" />
                        <span className="text-2xl font-bold font-mono text-white">{data.percentage}% Match</span>
                    </motion.div>

                    {/* Skills Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2.5 }}
                            className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-2 mb-4 text-green-500">
                                <CheckCircle2 size={18} />
                                <span className="font-mono text-sm uppercase tracking-wider">Acquired</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.matchedSkills.length > 0 ? (
                                    data.matchedSkills.map(skill => (
                                        <span key={skill} className={`text-sm px-3 py-1.5 rounded-lg border ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'}`}>
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-neutral-500 italic text-sm">Starting out...</span>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2.7 }}
                            className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-2 mb-4 text-orange-400">
                                <TrendingUp size={18} />
                                <span className="font-mono text-sm uppercase tracking-wider">To Learn</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.missingSkills.length > 0 ? (
                                    data.missingSkills.map(skill => (
                                        <span key={skill} className={`text-sm px-3 py-1.5 rounded-lg border border-dashed hover:border-solid transition-colors ${isDark ? 'bg-neutral-900/50 border-neutral-700 text-neutral-400' : 'bg-white/50 border-neutral-300 text-neutral-600'}`}>
                                            + {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-neutral-500 italic text-sm">You have it all!</span>
                                )}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </SlideLayout>
    )
}
