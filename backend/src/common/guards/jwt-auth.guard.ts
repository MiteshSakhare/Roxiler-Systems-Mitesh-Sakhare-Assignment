import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Convenience wrapper around Passport's JWT AuthGuard.
 * Applied globally or per-route to require a valid JWT.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
