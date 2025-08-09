
# Project Navigator - Frontend

A React-based frontend for Project Navigator — an academic project management platform that helps Admins, Faculty, and Students collaborate efficiently.



## Overview

This frontend provides role-based dashboards and features such as project group management, task activation, submissions, and evaluations. It connects to a backend API and uses JWT for authentication.



## Tech Stack

- React.js  
- Tailwind CSS  
- React Router DOM  
- Axios  
- JWT Decode  
- React Toastify  
- Lucide React  
- PapaParse (for CSV export)  
- Vite (build tool)



## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/project-navigator-frontend.git
   cd project-navigator-frontend


2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root folder with the following content:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```


## Available Scripts

* `npm run dev` — Run the app in development mode with hot reload
* `npm run build` — Build the app for production
* `npm run preview` — Preview the production build locally
* `npm run lint` — Run ESLint for code quality checks



## Notes

* Make sure your backend server is running at the URL specified in `VITE_API_BASE_URL`.
* For file uploads, Cloudinary integration is handled in the backend, frontend only needs the API base URL.



## Acknowledgments

Thanks to Dr. Pankaj Warule for guidance and Aviraj Kale for technical support.


Feel free to reach out if you have any questions or want to collaborate!


