/**
 * Fixture data for history page
 * Simulates processed events from the backend
 */

const historyFixtures = [
  {
    id: 1,
    type: 'task',
    status: 'success',
    timestamp: new Date('2026-01-07T09:30:00').toISOString(),
    inputText: 'Buy almond milk and coffee beans on the way home',
    result: 'Added to Grocery List',
    output: {
      list: 'Grocery List',
      items: ['Almond milk', 'Coffee beans']
    },
    feedback: null
  },
  {
    id: 2,
    type: 'event',
    status: 'success',
    timestamp: new Date('2026-01-07T08:00:00').toISOString(),
    inputText: 'Sync with dev team tomorrow at 10am about the API',
    result: 'Calendar event created',
    output: {
      eventTitle: 'Dev Sync',
      date: '2026-01-08',
      time: '10:00 AM',
      calendar: 'Work Calendar'
    },
    feedback: 'up'
  },
  {
    id: 3,
    type: 'reminder',
    status: 'success',
    timestamp: new Date('2026-01-06T15:30:00').toISOString(),
    inputText: 'Cancel netflix subscription before the 15th',
    result: 'Reminder set',
    output: {
      reminderDate: 'Oct 14th, 9:00 AM',
      notification: 'enabled'
    },
    feedback: null
  },
  {
    id: 4,
    type: 'task',
    status: 'failed',
    timestamp: new Date('2026-01-07T07:15:00').toISOString(),
    inputText: 'Schedule dentist appointment for next week sometime between 2-4pm on a Tuesday or Thursday',
    result: 'Failed to process',
    error: 'Unable to determine specific date and time. Please provide exact date.',
    feedback: 'down'
  },
  {
    id: 5,
    type: 'event',
    status: 'success',
    timestamp: new Date('2026-01-06T14:00:00').toISOString(),
    inputText: 'Lunch meeting with Sarah at Olive Garden on Main Street this Friday at 1pm',
    result: 'Calendar event created',
    output: {
      eventTitle: 'Lunch with Sarah',
      location: 'Olive Garden, Main Street',
      date: '2026-01-10',
      time: '1:00 PM',
      calendar: 'Personal Calendar'
    },
    feedback: 'up'
  },
  {
    id: 6,
    type: 'reminder',
    status: 'success',
    timestamp: new Date('2026-01-06T11:20:00').toISOString(),
    inputText: 'Remind me to call mom tonight at 7pm',
    result: 'Reminder set',
    output: {
      reminderDate: 'Jan 6th, 7:00 PM',
      notification: 'enabled'
    },
    feedback: null
  },
  {
    id: 7,
    type: 'task',
    status: 'pending',
    timestamp: new Date('2026-01-07T10:45:00').toISOString(),
    inputText: 'Research and compare prices for new laptops under $1000 with at least 16GB RAM',
    result: 'Processing...',
    feedback: null
  },
  {
    id: 8,
    type: 'event',
    status: 'failed',
    timestamp: new Date('2026-01-05T16:30:00').toISOString(),
    inputText: 'Team standup every morning except weekends',
    result: 'Failed to process',
    error: 'Recurring events require specific start date. Please specify when to begin.',
    feedback: null
  },
  {
    id: 9,
    type: 'task',
    status: 'success',
    timestamp: new Date('2026-01-05T13:10:00').toISOString(),
    inputText: 'Pick up dry cleaning by Friday',
    result: 'Added to To-Do List',
    output: {
      list: 'To-Do List',
      deadline: 'Jan 10th'
    },
    feedback: 'up'
  },
  {
    id: 10,
    type: 'reminder',
    status: 'success',
    timestamp: new Date('2026-01-05T09:00:00').toISOString(),
    inputText: 'Water the plants every Sunday morning',
    result: 'Recurring reminder set',
    output: {
      recurring: 'Weekly on Sundays',
      time: '9:00 AM'
    },
    feedback: null
  },
  {
    id: 11,
    type: 'event',
    status: 'success',
    timestamp: new Date('2026-01-04T17:45:00').toISOString(),
    inputText: 'Book flight to NYC for Feb 15-20 for the design conference',
    result: 'Travel task created',
    output: {
      type: 'Flight booking',
      destination: 'NYC',
      dates: 'Feb 15-20, 2026',
      purpose: 'Design conference'
    },
    feedback: null
  },
  {
    id: 12,
    type: 'task',
    status: 'success',
    timestamp: new Date('2026-01-04T14:20:00').toISOString(),
    inputText: 'Submit expense report with receipts from last week business trip',
    result: 'Added to To-Do List',
    output: {
      list: 'Work Tasks',
      priority: 'high',
      deadline: 'Jan 7th'
    },
    feedback: 'up'
  },
  {
    id: 13,
    type: 'reminder',
    status: 'failed',
    timestamp: new Date('2026-01-04T10:30:00').toISOString(),
    inputText: 'Tell me when its a good time',
    result: 'Failed to process',
    error: 'Cannot determine what to remind about or when. Please provide specific details.',
    feedback: 'down'
  },
  {
    id: 14,
    type: 'event',
    status: 'success',
    timestamp: new Date('2026-01-03T16:00:00').toISOString(),
    inputText: 'Quarterly review meeting Jan 15th 3pm with entire marketing team',
    result: 'Calendar event created',
    output: {
      eventTitle: 'Quarterly Review Meeting',
      attendees: 'Marketing Team',
      date: '2026-01-15',
      time: '3:00 PM',
      calendar: 'Work Calendar'
    },
    feedback: null
  },
  {
    id: 15,
    type: 'task',
    status: 'success',
    timestamp: new Date('2026-01-03T11:15:00').toISOString(),
    inputText: 'Order birthday present for dad before next Monday',
    result: 'Added to Shopping List',
    output: {
      list: 'Shopping List',
      deadline: 'Jan 6th',
      category: 'birthday gift'
    },
    feedback: null
  },
  {
    id: 16,
    type: 'event',
    status: 'pending',
    timestamp: new Date('2026-01-07T10:50:00').toISOString(),
    inputText: 'Annual company retreat March 20-22 in Lake Tahoe - need to RSVP and book accommodation',
    result: 'Processing...',
    feedback: null
  },
  {
    id: 17,
    type: 'task',
    status: 'success',
    timestamp: new Date('2026-01-02T15:40:00').toISOString(),
    inputText: 'Review and approve the Q4 budget proposals from finance team',
    result: 'Added to Work Tasks',
    output: {
      list: 'Work Tasks',
      priority: 'high',
      deadline: 'Jan 5th'
    },
    feedback: 'up'
  },
  {
    id: 18,
    type: 'reminder',
    status: 'success',
    timestamp: new Date('2026-01-02T12:00:00').toISOString(),
    inputText: 'Remind me to take my vitamins every morning at 8am',
    result: 'Recurring reminder set',
    output: {
      recurring: 'Daily',
      time: '8:00 AM'
    },
    feedback: null
  },
  {
    id: 19,
    type: 'event',
    status: 'success',
    timestamp: new Date('2026-01-01T19:30:00').toISOString(),
    inputText: 'Dinner with the Johnsons on Saturday Jan 11th at 7pm at their place',
    result: 'Calendar event created',
    output: {
      eventTitle: 'Dinner with the Johnsons',
      location: 'Their place',
      date: '2026-01-11',
      time: '7:00 PM',
      calendar: 'Personal Calendar'
    },
    feedback: 'up'
  },
  {
    id: 20,
    type: 'task',
    status: 'failed',
    timestamp: new Date('2026-01-01T14:15:00').toISOString(),
    inputText: 'Do that thing we talked about',
    result: 'Failed to process',
    error: 'Insufficient information. Cannot determine what task you are referring to.',
    feedback: 'down'
  },
  // Additional events for pagination testing
  ...Array.from({ length: 30 }, (_, i) => {
    const day = (Math.floor(i / 10) + 1).toString().padStart(2, '0');
    const hour = (10 + (i % 14)).toString().padStart(2, '0');
    const minute = (i % 60).toString().padStart(2, '0');
    return {
    id: 21 + i,
    type: ['task', 'event', 'reminder'][i % 3],
    status: ['success', 'failed', 'pending'][i % 3],
    timestamp: new Date(`2026-01-${day}T${hour}:${minute}:00`).toISOString(),
    inputText: `Sample event ${21 + i}: This is a test event with some longer text to demonstrate truncation and expansion functionality. It contains enough content to require showing a "Read More" button in the UI.`,
    result: i % 3 === 0 ? 'Successfully processed' : i % 3 === 1 ? 'Failed to process' : 'Processing...',
    error: i % 3 === 1 ? 'Sample error message for testing' : undefined,
    output: i % 3 === 0 ? { data: 'Sample output' } : undefined,
    feedback: i % 4 === 0 ? 'up' : i % 4 === 1 ? 'down' : null
    };
  })
];

export default historyFixtures;
