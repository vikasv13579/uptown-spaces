import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { LeadStatus, LeadSource, PropertyType } from '../types/enums.js';
import { Prisma } from '@prisma/client';

export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, email, budget, location, propertyType, source, status } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        budget: new Prisma.Decimal(budget),
        location,
        propertyType: propertyType as PropertyType,
        source: source as LeadSource,
        status: (status as LeadStatus) || LeadStatus.NEW,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      status,
      source,
      propertyType,
      search,
      minBudget,
      maxBudget,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query as any;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.LeadWhereInput = {};

    if (status) where.status = status as LeadStatus;
    if (source) where.source = source as LeadSource;
    if (propertyType) where.propertyType = propertyType as PropertyType;

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget !== undefined) where.budget.gte = new Prisma.Decimal(minBudget);
      if (maxBudget !== undefined) where.budget.lte = new Prisma.Decimal(maxBudget);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          _count: {
            select: { notes: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { budget, ...otherFields } = req.body;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }

    const updateData: Prisma.LeadUpdateInput = {
      ...otherFields,
    };

    if (budget !== undefined) {
      updateData.budget = new Prisma.Decimal(budget);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }

    await prisma.lead.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const createLeadNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: leadId } = req.params;
    const { content } = req.body;

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId,
        content,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: leadId } = req.params;

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }

    const notes = await prisma.leadNote.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalLeads, leadsByStatus, leadsBySource, totalBudgetRaw] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.lead.groupBy({
        by: ['source'],
        _count: { source: true },
      }),
      prisma.lead.aggregate({
        _sum: { budget: true },
      }),
    ]);

    const statusCounts = leadsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const sourceCounts = leadsBySource.reduce((acc, curr) => {
      acc[curr.source] = curr._count.source;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        totalBudget: totalBudgetRaw._sum.budget ? Number(totalBudgetRaw._sum.budget) : 0,
        statusCounts,
        sourceCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};
