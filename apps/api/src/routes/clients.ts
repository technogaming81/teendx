import { Router } from 'express';
import { prisma } from '@teendx/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schema
const createClientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  gstNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  acquisitionSource: z.string().optional(),
});

// GET /api/clients - List all clients
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { invoices: true, projects: true },
        },
      },
    });

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clients',
    });
  }
});

// GET /api/clients/:id - Get single client
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        invoices: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        projects: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client',
    });
  }
});

// POST /api/clients - Create new client
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const validated = createClientSchema.parse(req.body);

    const client = await prisma.client.create({
      data: {
        ...validated,
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create client',
    });
  }
});

// PUT /api/clients/:id - Update client
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const validated = createClientSchema.partial().parse(req.body);

    const client = await prisma.client.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: validated,
    });

    if (client.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
      });
    }

    const updatedClient = await prisma.client.findUnique({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update client',
    });
  }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const client = await prisma.client.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (client.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
      });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete client',
    });
  }
});

export default router;
