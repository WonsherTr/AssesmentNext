import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk';

// User Schema (simplified for seeding)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['client', 'agent'] },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Ticket Schema (simplified for seeding)
const TicketSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'] },
  priority: { type: String, enum: ['low', 'medium', 'high'] },
}, { timestamps: true });

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

// Comment Schema (simplified for seeding)
const CommentSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const clientPassword = await bcrypt.hash('client123', salt);
    const agentPassword = await bcrypt.hash('agent123', salt);

    // Create users
    console.log('Creating users...');
    const client = await User.create({
      name: 'John Client',
      email: 'client@helpdesk.com',
      password: clientPassword,
      role: 'client',
    });

    const client2 = await User.create({
      name: 'Jane Doe',
      email: 'jane@helpdesk.com',
      password: clientPassword,
      role: 'client',
    });

    const agent = await User.create({
      name: 'Mike Agent',
      email: 'agent@helpdesk.com',
      password: agentPassword,
      role: 'agent',
    });

    const agent2 = await User.create({
      name: 'Sarah Support',
      email: 'sarah@helpdesk.com',
      password: agentPassword,
      role: 'agent',
    });

    console.log('Users created:');
    console.log('  - client@helpdesk.com / client123 (Client)');
    console.log('  - jane@helpdesk.com / client123 (Client)');
    console.log('  - agent@helpdesk.com / agent123 (Agent)');
    console.log('  - sarah@helpdesk.com / agent123 (Agent)');

    // Create sample tickets
    console.log('Creating sample tickets...');
    const ticket1 = await Ticket.create({
      title: 'Cannot access my account',
      description: 'I have been trying to log into my account for the past hour but keep getting an error message saying "Invalid credentials". I have reset my password twice but still cannot access my account. Please help urgently!',
      createdBy: client._id,
      status: 'open',
      priority: 'high',
    });

    const ticket2 = await Ticket.create({
      title: 'Feature request: Dark mode',
      description: 'It would be great if the application had a dark mode option. Working late at night with the bright theme is quite straining on the eyes. Could you please consider adding this feature?',
      createdBy: client._id,
      status: 'in_progress',
      priority: 'low',
      assignedTo: agent._id,
    });

    const ticket3 = await Ticket.create({
      title: 'Payment not processed correctly',
      description: 'My payment was deducted from my bank account but the order shows as unpaid. Transaction ID: TXN-123456. Amount: $99.99. Please investigate and resolve this issue.',
      createdBy: client2._id,
      status: 'resolved',
      priority: 'high',
      assignedTo: agent2._id,
    });

    const ticket4 = await Ticket.create({
      title: 'How to export data?',
      description: 'I need to export my data for a report. Could you please guide me on how to do this? I could not find the option in the settings.',
      createdBy: client2._id,
      status: 'closed',
      priority: 'medium',
      assignedTo: agent._id,
    });

    const ticket5 = await Ticket.create({
      title: 'App crashes on mobile',
      description: 'The mobile application crashes every time I try to upload a file larger than 5MB. I am using iPhone 14 with iOS 17. This is blocking my workflow.',
      createdBy: client._id,
      status: 'open',
      priority: 'medium',
    });

    console.log('Tickets created: 5');

    // Create sample comments
    console.log('Creating sample comments...');
    await Comment.create({
      ticketId: ticket2._id,
      author: agent._id,
      message: 'Hi John! Thank you for your feature request. We are currently working on implementing dark mode. It should be available in the next release.',
    });

    await Comment.create({
      ticketId: ticket2._id,
      author: client._id,
      message: 'That is great news! Looking forward to it. Any ETA on the release?',
    });

    await Comment.create({
      ticketId: ticket2._id,
      author: agent._id,
      message: 'We are targeting the end of this month for the release. I will keep you updated!',
    });

    await Comment.create({
      ticketId: ticket3._id,
      author: agent2._id,
      message: 'Hi Jane, I have investigated this issue. There was a temporary glitch in our payment gateway. Your payment has been processed and your order is now marked as paid.',
    });

    await Comment.create({
      ticketId: ticket3._id,
      author: client2._id,
      message: 'Thank you for the quick resolution!',
    });

    await Comment.create({
      ticketId: ticket4._id,
      author: agent._id,
      message: 'Hi Jane! You can export your data by going to Settings > Data Management > Export Data. You can choose the format (CSV or JSON) and the date range.',
    });

    await Comment.create({
      ticketId: ticket4._id,
      author: client2._id,
      message: 'Found it! Thank you so much for the help.',
    });

    console.log('Comments created: 7');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nYou can now log in with:');
    console.log('  Client: client@helpdesk.com / client123');
    console.log('  Agent:  agent@helpdesk.com / agent123');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seed();
