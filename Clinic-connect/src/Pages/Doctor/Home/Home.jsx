import { BackgroundCanvas } from "../../BackgroundCanvas";

export const DoctorHome = () => {
  return (
    <BackgroundCanvas section={
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add dashboard cards or components here */}
        </div>
      </div>
    }/>
  );
}; 