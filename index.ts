import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Clerk
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  throw new Error('CLERK_SECRET_KEY is not defined in .env');
}

// Middleware to handle Clerk authentication errors
const handleClerkAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 401 || err.status === 403) {
    return res.status(err.status).json({ error: 'Unauthorized' });
  }
  next(err);
};

// Apply Clerk authentication middleware globally
app.use(ClerkExpressWithAuth({ secretKey: clerkSecretKey }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Health check (public route)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Get user data
app.get('/api/user', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get player info
app.get('/api/player-info', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('player_info')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get player resources
app.get('/api/player-resources', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('player_resources')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get military stats
app.get('/api/military-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('military_stats')
      .select('stats')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Update military stats
app.post('/api/military-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({ error: 'Stats required' });
    }

    const { data, error } = await supabase
      .from('military_stats')
      .upsert({ user_id: userId, stats, created_at: new Date().toISOString() })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get resources stats
app.get('/api/resources-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('resources_stats')
      .select('stats')
      .eq('user_id', userId);

    if_TOKEN: if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Update resources stats
app.post('/api/resources-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({ error: 'Stats required' });
    }

    const { data, error } = await supabase
      .from('resources_stats')
      .upsert({ user_id: userId, stats, created_at: new Date().toISOString() })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get development stats
app.get('/api/development-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('development_stats')
      .select('stats')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Update development stats
app.post('/api/development-stats', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({ error: 'Stats required' });
    }

    const { data, error } = await supabase
      .from('development_stats')
      .upsert({ user_id: userId, stats, created_at: new Date().toISOString() })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get alliances
app.get('/api/alliances', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const { data, error } = await supabase
      .from('alliances')
      .select('*')
      .eq('manager_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get alliance members
app.get('/api/alliance-members/:allianceId', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    const { allianceId } = req.params;

    // Verify user is the manager of the alliance
    const { data: alliance, error: allianceError } = await supabase
      .from('alliances')
      .select('manager_id')
      .eq('id', allianceId)
      .single();

    if (allianceError || alliance.manager_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the manager of this alliance' });
    }

    const { data, error } = await supabase
      .from('alliance_members')
      .select('*')
      .eq('alliance_id', allianceId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get battle events
app.get('/api/battle-events/:allianceMemberId', ClerkExpressRequireAuth(), handleClerkAuthError, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    const { allianceMemberId } = req.params;

    // Verify user has access to the alliance member's events
    const { data: member, error: memberError } = await supabase
      .from('alliance_members')
      .select('alliance_id')
      .eq('id', allianceMemberId)
      .single();

    if (memberError) {
      return res.status(500).json({ error: memberError.message });
    }

    const { data: alliance, error: allianceError } = await supabase
      .from('alliances')
      .select('manager_id')
      .eq('id', member.alliance_id)
      .single();

    if (allianceError || alliance.manager_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the manager of this alliance' });
    }

    const { data, error } = await supabase
      .from('battle_events')
      .select('*')
      .eq('alliance_member_id', allianceMemberId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});