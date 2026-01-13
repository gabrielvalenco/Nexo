import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Redirect('/docs', 302)
  root() {
    return;
  }
}
