import { Link } from "react-router-dom";
import { BackgroundCanvas } from "../../BackgroundCanvas";


export const Search = () => {
    const specialists = [
      { name: "Pediatric Specialist", available: true },
      { name: "Oftalmologi Specialist", available: true },
      { name: "Internist Specialist", available: true },
    ];
  
    const doctors = [
      { name: "Dr. Marci Maiden", rating: 4.5, specialty: "Internist Specialist" },
      { name: "Dr. Raze Invoker", rating: 4.5, specialty: "Internist Specialist" },
      // Add more doctors as needed
    ];
  
    return (
        < BackgroundCanvas section={
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Doctors</h1>
        
                {/* Latest Section */}
                <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Latest</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {specialists.map((specialist, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow-sm">
                        <h3 className="font-medium mb-2">{specialist.name}</h3>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        Available
                        </span>
                    </div>
                    ))}
                </div>
                </section>
        
                {/* Madelyn Hospital Section */}
                <section>
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-semibold">Madelyn Hospital</h2>
                    <span className="text-gray-500">Radiant Hospital</span>
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{doctor.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <span>★</span>
                            <span>{doctor.rating}</span>
                        </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
                        <div className="flex justify-end items-center">
                            <Link to="/Patient/Booking" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                Book
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>
                </section>
            </div>
        }
        />
      
    );
  };
  
