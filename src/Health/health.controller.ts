import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class HealthController {
  constructor(
    @Optional()
    @Inject(getConnectionToken())
    private dbConnection?: Connection,
    private configService?: ConfigService,
  ) {}

  @Get('health')
  health() {
    const mongoStatus = this.dbConnection?.readyState ?? 0;
    const isDbConnected = mongoStatus === 1;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: isDbConnected,
        state: mongoStatus === 0 ? 'disconnected' : mongoStatus === 1 ? 'connected' : mongoStatus === 2 ? 'connecting' : 'unknown'
      },
      version: '0.0.1'
    };
  }
}
