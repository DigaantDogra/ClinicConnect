# Clinic Conect Web application

### Overview

This ongoing project streamlines healthcare access via a digital marketplace empowering private clinics to efficiently offer services. The platform connects patients directly with care, reducing reliance on traditional facilities through a secure, user-centric interface.

### Features

- **Appointment Scheduling**: Schedule appointments with doctors for an in-person or online meeting.
- **AI Healthcare Package Recomendation System**: In this application we use Artificial Intelligence, to generate a personalized and doctor-authorized healthcare service package based on the location, types of clinics, and patients' medical documents.
- **Notifications**: This application leverages a notification system for all types of users.
- **Role-based access control**: This application deals with patients and doctors, who both have different dashboards and user goals.

### Tech Used

- **Frontend**: React.js, tailwindcss, Bootstrap, Javascript
- **Backend**: ASP.NET 9, C#, Firebase
- **Development Platform**: VScode, this is a fully responsive web application that will be accessible to all browsers

### Future Roadmap

##### **Progressive Web Application (PWA) Implementation**: 
- We will be develop the application as a PWA to ensure cross-platform compatibility (iOS, Android, desktop).

##### **Location Services**: At the moment we have not implement locations view but this non-functional requirment are will be covered then.
- Placeholder UI component for future geolocation features.
- Planned functionality:
- Clinic locator with real-time availability.

Travel time estimation integration.

##### **Emergency Appointment System**: We will integrate emergency appointments to our application for emergency/priority services.
- Real-time notifications to medical staff for emergency cases.
- Visual distinction in UI (color-coding, priority tags).

##### **Medical Administrator Role Integration**: Introduce a Medical Administrator actor with permissions to:
- Manage doctor schedules and appointment slots.
- Oversee clinic documents (licenses, operational policies).
- Access patient medical records only with explicit patient consent (GDPR/hipaa-compliant).
- Audit trail implementation for document access/modification.