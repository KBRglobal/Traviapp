/**
 * Simple in-memory job queue for background processing
 * Handles tasks like translation, AI generation, email sending
 */

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type JobType = 'translate' | 'ai_generate' | 'email' | 'image_process' | 'cleanup';

export interface Job<T = unknown> {
  id: string;
  type: JobType;
  status: JobStatus;
  data: T;
  result?: unknown;
  error?: string;
  retries: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: number;
}

type JobHandler<T = unknown> = (data: T) => Promise<unknown>;

class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private handlers: Map<JobType, JobHandler> = new Map();
  private processing: Set<string> = new Set();
  private maxConcurrent: number = 3;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.startProcessing();
  }

  /**
   * Register a handler for a job type
   */
  registerHandler<T>(type: JobType, handler: JobHandler<T>) {
    this.handlers.set(type, handler as JobHandler);
    console.log(`[JobQueue] Registered handler for job type: ${type}`);
  }

  /**
   * Add a job to the queue
   */
  addJob<T>(type: JobType, data: T, options?: { priority?: number; maxRetries?: number }): string {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const job: Job<T> = {
      id,
      type,
      status: 'pending',
      data,
      retries: 0,
      maxRetries: options?.maxRetries ?? 3,
      createdAt: new Date(),
      priority: options?.priority ?? 0,
    };

    this.jobs.set(id, job as Job);
    console.log(`[JobQueue] Added job ${id} of type ${type}`);

    return id;
  }

  /**
   * Get job status
   */
  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  /**
   * Get all jobs by status
   */
  getJobsByStatus(status: JobStatus): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Get queue statistics
   */
  getStats(): { pending: number; processing: number; completed: number; failed: number; total: number } {
    const jobs = Array.from(this.jobs.values());
    return {
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      total: jobs.length,
    };
  }

  /**
   * Start processing jobs
   */
  private startProcessing() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => this.processNext(), 1000);
    console.log('[JobQueue] Started processing');
  }

  /**
   * Stop processing jobs
   */
  stopProcessing() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[JobQueue] Stopped processing');
  }

  /**
   * Process next available job
   */
  private async processNext() {
    if (this.processing.size >= this.maxConcurrent) return;

    // Get next pending job (highest priority first)
    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .sort((a, b) => b.priority - a.priority);

    const job = pendingJobs[0];
    if (!job) return;

    const handler = this.handlers.get(job.type);
    if (!handler) {
      console.warn(`[JobQueue] No handler registered for job type: ${job.type}`);
      return;
    }

    // Mark job as processing
    job.status = 'processing';
    job.startedAt = new Date();
    this.processing.add(job.id);

    console.log(`[JobQueue] Processing job ${job.id} of type ${job.type}`);

    try {
      const result = await handler(job.data);
      job.status = 'completed';
      job.result = result;
      job.completedAt = new Date();
      console.log(`[JobQueue] Completed job ${job.id}`);
    } catch (error) {
      job.retries++;
      if (job.retries < job.maxRetries) {
        job.status = 'pending'; // Retry
        console.warn(`[JobQueue] Job ${job.id} failed, retrying (${job.retries}/${job.maxRetries})`);
      } else {
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : String(error);
        job.completedAt = new Date();
        console.error(`[JobQueue] Job ${job.id} failed permanently:`, error);
      }
    } finally {
      this.processing.delete(job.id);
    }

    // Clean up old completed/failed jobs (keep last 1000)
    this.cleanup();
  }

  /**
   * Clean up old jobs to prevent memory bloat
   */
  private cleanup() {
    const maxJobs = 1000;
    const jobs = Array.from(this.jobs.entries())
      .filter(([_, job]) => job.status === 'completed' || job.status === 'failed')
      .sort((a, b) => (b[1].completedAt?.getTime() || 0) - (a[1].completedAt?.getTime() || 0));

    if (jobs.length > maxJobs) {
      const toRemove = jobs.slice(maxJobs);
      toRemove.forEach(([id]) => this.jobs.delete(id));
      console.log(`[JobQueue] Cleaned up ${toRemove.length} old jobs`);
    }
  }

  /**
   * Cancel a pending job
   */
  cancelJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (job && job.status === 'pending') {
      this.jobs.delete(id);
      console.log(`[JobQueue] Cancelled job ${id}`);
      return true;
    }
    return false;
  }

  /**
   * Retry a failed job
   */
  retryJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (job && job.status === 'failed') {
      job.status = 'pending';
      job.retries = 0;
      job.error = undefined;
      job.completedAt = undefined;
      console.log(`[JobQueue] Retrying job ${id}`);
      return true;
    }
    return false;
  }
}

// Singleton instance
export const jobQueue = new JobQueue();

// Export types for handlers
export interface TranslateJobData {
  contentId: string;
  targetLocale: string;
  priority?: number;
}

export interface AiGenerateJobData {
  type: string;
  topic: string;
  keywords?: string[];
  priority?: number;
}

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  template?: string;
}

export interface ImageProcessJobData {
  mediaId: string;
  operations: Array<{
    type: 'resize' | 'crop' | 'compress';
    params: Record<string, unknown>;
  }>;
}

export interface CleanupJobData {
  type: 'expired_sessions' | 'old_drafts' | 'unused_media';
  olderThan?: number; // days
}
