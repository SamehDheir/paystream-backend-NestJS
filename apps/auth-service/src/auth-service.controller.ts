import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  // POST /auth/login
  @Post('login')
  async login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    // Setting up the HttpOnly Cookie
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return { message: 'Logged in successfully', user: result.user };
  }

  // POST /auth/register
  @Post('register')
  async register(@Body() authDto: any) {
    return await this.authService.register(authDto.username, authDto.password);
  }
}
