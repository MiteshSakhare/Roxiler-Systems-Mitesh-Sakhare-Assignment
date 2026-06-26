import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      statusCode: 200,
      message: 'RateIT API is running successfully!',
      status: 'OK'
    };
  }
}
