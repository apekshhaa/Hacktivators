import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, Play, Activity, Heart, Footprints, MoreVertical, ChevronDown, Sparkles, Gift, Home as HomeIcon, Settings as SettingsIcon } from 'lucide-react';
import heartBeatVideo from '../../assets/heart_beat.webm';
import HospitalMapModal from '../../components/user/HospitalMapModal';
import ChatBot from '../../components/user/ChatBot';
import BookingModal from '../../components/user/BookingModal';
import PreferencesModal from '../../components/user/PreferencesModal';
import RoleIndicator from '../../components/common/RoleIndicator';
import CommunityRiskWidget from '../../components/user/CommunityRiskWidget';
import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

const Home = () => {
    const navigate = useNavigate();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const householdId = localStorage.getItem('userHouseholdId');

    const handleFindHospitals = () => {
        setIsMapOpen(true);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] text-white overflow-x-hidden relative">

            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            {/* Navbar Container - Floating Pill */}
            <div className="pt-6 pb-2 px-4 flex justify-center sticky top-0 z-50">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-3 py-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center w-[98%] max-w-[1600px] shadow-2xl">

                    {/* Logo (Left Aligned) */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-white">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-medium tracking-wide whitespace-nowrap">Swasthya Parivar</span>
                    </div>

                    {/* Role Indicator (Middle) */}
                    <div className="hidden md:flex justify-center">
                        <RoleIndicator role="user" householdId={householdId} />
                    </div>


                    {/* Right Actions (Right Aligned) */}
                    <div className="flex items-center justify-end gap-2 pr-1">
                        <div id="nav-translate-container" className="flex items-center justify-center mr-2"></div>
                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0">
                            <HomeIcon size={18} />
                        </button>

                        <button
                            onClick={() => setIsPreferencesOpen(true)}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                        >
                            <SettingsIcon size={18} />
                        </button>




                        <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 whitespace-nowrap">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 lg:pt-20 pb-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="space-y-8">

                        {/* Tag */}


                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
                            Smarter <br />
                            Healthcare Starts <br />
                            With <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-8">Swasthya Parivar.</span>
                        </h1>

                        {/* Subtext */}
                        {/* Action Links */}
                        <div className="pt-2 flex flex-wrap items-center gap-6">
                            <button onClick={() => navigate('/summary', { state: { from: '/home' } })} className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors border-b border-accent/30 hover:border-accent pb-0.5">
                                <Activity size={18} />
                                Track Household Health
                            </button>
                            <Link to="/rewards" state={{ from: '/home' }} className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors border-b border-accent/30 hover:border-accent pb-0.5">
                                <Gift size={18} />
                                Check Rewards
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            {/* Actions removed as per user request */}
                        </div>
                    </div>

                    {/* Right Visuals - Minimalist */}
                    <div className="relative h-[600px] flex items-center justify-center">
                        {/* Improved Heart Video */}
                        <video
                            src={heartBeatVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-[500px] w-auto object-contain z-10 drop-shadow-[0_0_50px_rgba(209,240,114,0.3)] mix-blend-screen brightness-110 contrast-125 transition-all duration-1000"
                        />

                        {/* Circular Graphic Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full z-0"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full z-0 opacity-50"></div>
                    </div>
                </div>
            </main>

            {/* Community Risk Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 relative z-10">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                        Community Health Pulse
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Live 14-day outbreak risk indicator for your village</p>
                </div>
                <CommunityRiskWidget />
            </section>

            {/* Map Modal */}
            {isMapOpen && <HospitalMapModal onClose={() => setIsMapOpen(false)} householdId={householdId} />}

            <ChatBot />
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} householdId={householdId} />
            <PreferencesModal
                isOpen={isPreferencesOpen}
                onClose={() => setIsPreferencesOpen(false)}
                householdId={householdId}
            />
        </div >
    );
};

export default Home;
