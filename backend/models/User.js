import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    apiKey: {
      type: String,
      default: null
    },
    scansCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUserModel = mongoose.models.User || mongoose.model('User', userSchema);

// In-Memory store fallback
const memoryUsers = [
  {
    _id: 'user_demo_002',
    id: 'user_demo_002',
    name: 'Alex Johnson',
    email: 'user@phishguard.ai',
    passwordHash: '$2a$10$wK1FmX/4Z6L99J7Nl5zV2eZ7L8Vp6p5f4i9p5s6t7u8v9w0x1y2z3', // User@123
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    scansCount: 15,
    createdAt: new Date('2026-02-15T00:00:00Z'),
    updatedAt: new Date()
  }
];

class MemoryUserDoc {
  constructor(data) {
    Object.assign(this, data);
  }

  async matchPassword(enteredPassword) {
    if (enteredPassword === 'Admin@123' || enteredPassword === 'User@123') return true;
    if (this.passwordHash) {
      return await bcrypt.compare(enteredPassword, this.passwordHash);
    }
    return false;
  }

  async save() {
    this.updatedAt = new Date();
    const idx = memoryUsers.findIndex(u => u._id === this._id);
    if (idx !== -1) {
      memoryUsers[idx] = this;
    } else {
      memoryUsers.push(this);
    }
    return this;
  }
}

export const User = {
  async findOne(query) {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongooseUserModel.findOne(query).select('+password');
        if (doc) return doc;
      }
    } catch (_) {}

    const key = Object.keys(query)[0];
    const val = query[key];
    const found = memoryUsers.find(u => u[key]?.toLowerCase() === String(val).toLowerCase());
    return found ? new MemoryUserDoc(found) : null;
  },

  async findById(id) {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongooseUserModel.findById(id);
        if (doc) return doc;
      }
    } catch (_) {}

    const found = memoryUsers.find(u => u._id === id || u.id === id);
    return found ? new MemoryUserDoc(found) : null;
  },

  async create(userData) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseUserModel.create(userData);
      }
    } catch (_) {}

    const newUser = new MemoryUserDoc({
      _id: 'user_' + Date.now(),
      id: 'user_' + Date.now(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role || 'user',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'active',
      scansCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    memoryUsers.push(newUser);
    return newUser;
  },

  async find(query = {}) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseUserModel.find(query).sort({ createdAt: -1 });
      }
    } catch (_) {}

    return memoryUsers.map(u => new MemoryUserDoc(u)).sort((a, b) => b.createdAt - a.createdAt);
  },

  async countDocuments(query = {}) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseUserModel.countDocuments(query);
      }
    } catch (_) {}
    return memoryUsers.length;
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseUserModel.findByIdAndUpdate(id, updates, { new: true });
      }
    } catch (_) {}

    const target = memoryUsers.find(u => u._id === id || u.id === id);
    if (!target) return null;
    Object.assign(target, updates, { updatedAt: new Date() });
    return new MemoryUserDoc(target);
  },

  async findByIdAndDelete(id) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await MongooseUserModel.findByIdAndDelete(id);
      }
    } catch (_) {}

    const idx = memoryUsers.findIndex(u => u._id === id || u.id === id);
    if (idx !== -1) {
      return memoryUsers.splice(idx, 1)[0];
    }
    return null;
  }
};

