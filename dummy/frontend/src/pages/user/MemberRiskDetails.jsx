import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getHouseholdSummary } from '../../services/api';
import RiskDetector from '../../components/user/RiskDetector';

const MemberRiskDetails = () => {
    const { householdId, memberName } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!householdId) return;
        setLoading(true);
        getHouseholdSummary(householdId)
            .then(d => {
                if (d) setData(d);
                else setError('Household not found');
            })
            .catch(() => setError('Failed to load household data'))
            .finally(() => setLoading(false));
    }, [householdId]);

    const isHead = data?.head === localStorage.getItem("userName");
    const currentUserName = localStorage.getItem("userName") || data?.head || "";

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0d4648] to-[#2b4548] text-white flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-accent animate-spin mb-4" />
                <p>Loading member data...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0d4648] to-[#2b4548] text-white flex flex-col items-center justify-center px-4 text-center">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-400 mb-8">{error || 'Something went wrong.'}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#0d4648] to-[#2b4548] text-white p-6 md:p-10 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                {/* Header Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to Family Summary
                </button>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{memberName}'s Health Risk</h1>
                    <p className="text-gray-400">Detailed risk assessment and symptom checker.</p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <RiskDetector 
                        data={data}
                        currentUserName={currentUserName}
                        isHead={isHead || true} // Pass true so they bypass some restrictions if needed, but let's keep it standard
                        selectedMemberId={memberName}
                        forceSingleView={true}
                        singleMemberId={memberName}
                    />
                </div>
            </div>
        </div>
    );
};

export default MemberRiskDetails;
