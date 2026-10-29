/**
 * Author: OanhTP
 */
// Dữ liệu mẫu khởi tạo ban đầu tuân theo Data Model & Rubric của Assignment 01

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Academic & Curriculum', status: 1 },
  { id: 2, name: 'Campus Events', status: 1 },
  { id: 3, name: 'Technology & Innovation', status: 1 },
  { id: 4, name: 'Student Clubs & Activities', status: 0 },
];

export const INITIAL_USERS = [
  { id: 1, username: 'Admin', password: 'Admin', role: 1, status: 1 },
  { id: 2, username: 'staff1', password: '123', role: 2, status: 1 },
  { id: 3, username: 'staff2', password: '123', role: 2, status: 0 },
];

export const INITIAL_NEWS = [
  {
    id: 1,
    title: 'FPT University Welcomes New Semester with Tech Symposium',
    content: 'The new academic semester opens with a series of high-profile tech workshops and international keynotes for computing students.',
    categoryId: 3,
    createdBy: 'Admin',
    status: 1,
    tags: ['Tech', 'Symposium', 'Semester'],
  },
  {
    id: 2,
    title: 'Midterm Examination Schedule Announcement',
    content: 'Official timetable for SBA301 and related computing courses has been published on the student portal.',
    categoryId: 1,
    createdBy: 'Admin',
    status: 1,
    tags: ['Exam', 'Academic'],
  },
  {
    id: 3,
    title: 'Annual Club Fair and Cultural Exchange Day',
    content: 'Over 30 student clubs gathered this weekend featuring musical performances, creative booths, and community drives.',
    categoryId: 2,
    createdBy: 'staff1',
    status: 1,
    tags: ['Festival', 'Clubs'],
  },
  {
    id: 4,
    title: 'Guidelines for Upcoming Hackathon 2026',
    content: 'Registration is now open for students interested in solving real-world AI and Web challenges in a 48-hour sprint.',
    categoryId: 3,
    createdBy: 'staff1',
    status: 0,
    tags: ['Hackathon', 'AI', 'Competition'],
  },
];
