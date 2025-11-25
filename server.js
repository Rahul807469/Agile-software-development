const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data for demo
let courses = [
  {
    id: 1,
    title: 'Python Basics',
    level: 'Beginner',
    duration: '4 weeks',
    category: 'Programming',
    rating: 4.6,
    learners: 1200,
    description: 'Learn the fundamentals of Python programming with hands-on examples.'
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms in Java',
    level: 'Intermediate',
    duration: '6 weeks',
    category: 'Computer Science',
    rating: 4.8,
    learners: 950,
    description: 'Master core DSA concepts for coding interviews and competitive programming.'
  },
  {
    id: 3,
    title: 'Machine Learning Foundations',
    level: 'Intermediate',
    duration: '8 weeks',
    category: 'AI & ML',
    rating: 4.7,
    learners: 780,
    description: 'Understand key ML algorithms and workflows using real-world datasets.'
  },
  {
    id: 4,
    title: 'Web Development with HTML, CSS, JS',
    level: 'Beginner',
    duration: '5 weeks',
    category: 'Web Development',
    rating: 4.5,
    learners: 1500,
    description: 'Build modern, responsive websites from scratch with core web technologies.'
  }
];

let users = [
  {
    id: 1,
    name: 'Demo Student',
    email: 'student@example.com',
    enrolledCourseIds: [1]
  }
];

let nextUserId = users.length + 1;

// API routes
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Get single course
app.get('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courses.find(c => c.id === id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
});

// Register a user
app.post('/api/register', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }
  const user = {
    id: nextUserId++,
    name,
    email,
    enrolledCourseIds: []
  };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully', user });
});

// Enroll user into a course
app.post('/api/enroll', (req, res) => {
  const { email, courseId } = req.body;
  if (!email || !courseId) {
    return res.status(400).json({ message: 'Email and courseId are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found. Please register first.' });
  }

  const course = courses.find(c => c.id === parseInt(courseId, 10));
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (!user.enrolledCourseIds.includes(course.id)) {
    user.enrolledCourseIds.push(course.id);
  }

  res.json({ message: 'Enrolled successfully', user });
});

// Get user dashboard data
app.post('/api/dashboard', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const enrolledCourses = courses.filter(c => user.enrolledCourseIds.includes(c.id));
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    enrolledCourses
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
