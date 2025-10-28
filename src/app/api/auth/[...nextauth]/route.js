import { handlers } from '@/auth';

// Explicitly disable static export for this route
export const dynamic = 'force-dynamic';

export const { GET, POST } = handlers;
