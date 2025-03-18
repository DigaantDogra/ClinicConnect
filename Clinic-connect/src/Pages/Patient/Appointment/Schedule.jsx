

export const Schedule = () => {
    const appointments = [
        { date: '10/10/2020', time: '09:15-09:45am', doctor: 'Dr. Jacob Jones', reason: 'Mumps Stage II' },
        { date: '10/12/2020', time: '12:00-12:45pm', doctor: 'Dr. Theresa Webb', reason: 'Depression' },
        { date: '10/13/2020', time: '01:15-01:45pm', doctor: 'Dr. Jacob Jones', reason: 'Arthritis' },
        { date: '10/14/2020', time: '02:00-02:45pm', doctor: 'Dr. Arlene McCoy', reason: 'Fracture' },
        { date: '10/15/2020', time: '12:00-12:45pm', doctor: 'Dr. Esther Howard', reason: 'Depression' },
        { date: '10/17/2020', time: '01:15-01:45pm', doctor: 'Dr. Jacob Jones', reason: 'Dyslexia' },
        { date: '10/17/2020', time: '02:00-02:45pm', doctor: 'Dr. Theresa Webb', reason: 'Hypothermia' },
        { date: '10/18/2020', time: '09:15-09:45am', doctor: 'Dr. Esther Howard', reason: 'Sunburn' },
        { date: '10/19/2020', time: '12:00-12:45pm', doctor: 'Dr. Arlene McCoy', reason: 'Diarrhoea' },
        { date: '10/20/2020', time: '09:15-09:45am', doctor: 'Dr. Arlene McCoy', reason: 'Arthritis' },
      ];
    
      return (
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Request Appointment</h1>
          
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
      );
}