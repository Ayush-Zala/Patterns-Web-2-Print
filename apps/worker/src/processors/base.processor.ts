import { Logger } from '@nestjs/common';
import { Job, Worker, WorkerOptions, ConnectionOptions } from 'bullmq';

export abstract class BaseJobProcessor<TData = any, TResult = any> {
  protected readonly logger: Logger;
  private worker!: Worker;

  constructor(
    public readonly queueName: string,
    private readonly redisOptions: ConnectionOptions,
  ) {
    this.logger = new Logger(`Processor:${queueName}`);
  }

  protected abstract processJob(job: Job<TData, TResult>): Promise<TResult>;

  public start(): Worker {
    const options: WorkerOptions = {
      connection: this.redisOptions,
      concurrency: 5,
    };

    this.worker = new Worker<TData, TResult>(
      this.queueName,
      async (job) => {
        this.logger.log(`Processing job ${job.id} (${job.name}) on queue ${this.queueName}`);
        try {
          const result = await this.processJob(job);
          this.logger.log(`Completed job ${job.id} (${job.name})`);
          return result;
        } catch (error) {
          this.logger.error(
            `Failed job ${job.id} (${job.name}): ${(error as Error).message}`,
            (error as Error).stack,
          );
          throw error;
        }
      },
      options,
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    return this.worker;
  }

  public async stop(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
