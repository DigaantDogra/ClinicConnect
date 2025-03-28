import { BackgroundCanvas } from "../../BackgroundCanvas";
import { Link } from "react-router-dom";


export const Schedule = () => {
    const appointments = [
        { date: '10/10/2020', time: '09:15-09:45am', doctor: 'Dr. Jacob Jones', reason: 'Mumps Stage II' },
      ];
    
      return (<BackgroundCanvas section={
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-end">
            <Link to={"/Search"}>
            <h1 className="bg-blue-400 p-4 rounded-2xl text-white mb-3 hover:-translate-y-0.5 transition-all">Request Appointment</h1>
            </Link>
          </div>
          
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }/>
        
      );
}