import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Environment } from '@common/enums/environment.enum';
import { REQUEST_ID_HEADER } from '@common/constants/header.constants';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === Environment.Production;

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : ({
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                  },
                } as any),
            customProps: (req, res) => {
              return {
                requestId: req.headers[REQUEST_ID_HEADER] || req.id,
              };
            },
            autoLogging: {
              ignore: (req) => {
                return req.url === '/api/v1/system/health';
              },
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
