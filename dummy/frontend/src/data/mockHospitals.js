export const generateMockHospitals = (centerLat, centerLng) => {
    const hospitalNames = [
        "City General Hospital",
        "Community Care Center",
        "St. Mary's Medical Center",
        "Advanced Health Institute",
        "Sunrise Pediatric Clinic"
    ];

    const specializations = [
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "gynaecology ",
        "Dermatology",
        "General Surgery",
        "Orthopedics"
    ];

    const generateRandomOffset = () => (Math.random() - 0.5) * 0.05; // Approx 5km radius

    return hospitalNames.map((name, index) => {
        const waitingCount = Math.floor(Math.random() * 20) + 2;
        const doctors = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
            name: `Dr. ${['Smith', 'Patel', 'Jones', 'Wang', 'Garcia'][Math.floor(Math.random() * 5)]}`,
            specialty: specializations[Math.floor(Math.random() * specializations.length)],
            availableTime: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`
        }));

        return {
            id: index,
            name,
            lat: centerLat + generateRandomOffset(),
            lng: centerLng + generateRandomOffset(),
            waitingCount,
            doctors,
            distance: (Math.random() * 5).toFixed(1) // Mock distance
        };
    });
};
