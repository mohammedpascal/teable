import { All, Controller, NotFoundException, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve, join } from 'path';
import { Public } from '../features/auth/decorators/public.decorator';

@Controller()
@Public()
export class SpaController {
  private readonly indexHtmlPath: string;
  private readonly staticRootPath: string;
  private readonly staticAssetExtensions = [
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.json',
    '.ico',
    '.webmanifest',
    '.map',
  ];
  private readonly staticAssetDirectories = ['/assets/', '/images/', '/locales/'];

  constructor() {
    // Path to index.html in production build (absolute path required for sendFile)
    this.indexHtmlPath = resolve(__dirname, '../../start-app/dist/index.html');
    // Path to static files root directory
    this.staticRootPath = resolve(__dirname, '../../start-app/dist');
  }

  private isStaticAsset(path: string): boolean {
    // Check for static asset directories
    if (this.staticAssetDirectories.some((dir) => path.startsWith(dir))) {
      return true;
    }

    // Check for favicon.ico
    if (path === '/favicon.ico') {
      return true;
    }

    // Check for file extensions
    const hasExtension = this.staticAssetExtensions.some((ext) => path.endsWith(ext));
    if (hasExtension) {
      return true;
    }

    return false;
  }

  @All('*')
  serveSpa(@Req() req: Request, @Res({ passthrough: false }) res: Response): void {
    // Only serve SPA in production
    if (process.env.NODE_ENV !== 'production') {
      res.status(404).json({
        message: 'Not Found',
        status: 404,
        code: 'not_found',
      });
      return;
    }

    const path = req.path;

    // Exclude API routes and other backend routes
    if (
      path.startsWith('/api/') ||
      path === '/health' ||
      path.startsWith('/docs/') ||
      path.startsWith('/redocs/')
    ) {
      res.status(404).json({
        message: 'Not Found',
        status: 404,
        code: 'not_found',
      });
      return;
    }

    // Handle static assets - check if file exists and serve it, otherwise let ServeStaticModule handle it
    if (this.isStaticAsset(path)) {
      // Try to serve the static file if it exists
      const staticFilePath = join(this.staticRootPath, path);
      if (existsSync(staticFilePath)) {
        res.sendFile(resolve(staticFilePath));
        return;
      }
      // If file doesn't exist, throw NotFoundException to let static middleware handle it
      throw new NotFoundException();
    }

    // Serve index.html for all other routes (SPA routes)
    res.sendFile(this.indexHtmlPath);
  }
}

