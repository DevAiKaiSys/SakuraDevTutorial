import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService, UserToken } from './auth.service';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  // async refreshToken(@Req() req) {
  async refreshToken(@Req() req: { user: UserToken }) {
    console.log('refreshed');

    return await this.authService.refreshToken(req.user);
  }
}
