import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

const RoleIndicator = ({ role, householdId }) => {
    return (
        <div className="flex items-center justify-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2.5 shadow-xl transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${role === 'admin' ? 'bg-accent shadow-[0_0_8px_rgba(209,240,114,0.6)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'}`} />
                <div className="flex items-center gap-2">
                    {role === 'admin' ? (
                        <>
                            <ShieldCheck size={13} className="text-accent opacity-80" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                Administrator <span className="text-white/20 mx-1">|</span> <span className="text-accent/90">System Active</span>
                            </span>
                        </>
                    ) : (
                        <>
                            <User size={13} className="text-blue-400 opacity-80" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                Household <span className="text-white/20 mx-1">|</span> <span className="text-white tracking-normal font-mono">{householdId || 'HH-UNKNOWN'}</span>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleIndicator;
