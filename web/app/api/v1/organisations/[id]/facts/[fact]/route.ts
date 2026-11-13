import { factRoutes } from '@/ui/slice2-api';

const routes = factRoutes('organisation');

export const GET = routes.one;
export const PUT = routes.save;
