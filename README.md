# Issue Tracker Project

## Overview
The Issue Tracker project is a web application designed to help teams manage and track issues, bugs, and tasks. It provides a user-friendly interface for creating, assigning, and filtering issues based on various criteria such as type, status, priority, and assignee.

## Features
- Create, view, and edit issues
- Assign issues to team members
- Filter issues based on type, status, priority, and assignee
- View issue details, including title, description, assigned to, reported on, and reported by
- Search for issues using keywords

## Technologies Used
- Front-end: HTML, CSS, JavaScript, Bootstrap
- Back-end: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

## Getting Started
To get started with the Issue Tracker project, follow these steps:

1. Clone the repository:
```
git clone https://github.com/your-username/issue-tracker.git
```

2. Install dependencies:
```
cd issue-tracker
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory of the project and add the following variables:
```
MONGODB_URI=mongodb://localhost/issue-tracker
JWT_SECRET=your-secret-key
```

4. Start the server:
```
npm start
```

5. Access the application:
Open your browser and navigate to `http://localhost:3000`.

## Contributing
Contributions to the Issue Tracker project are welcome! If you'd like to contribute, please follow these guidelines:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and test them thoroughly
4. Commit your changes with a descriptive commit message
5. Push your branch to your forked repository
6. Submit a pull request to the main repository

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
