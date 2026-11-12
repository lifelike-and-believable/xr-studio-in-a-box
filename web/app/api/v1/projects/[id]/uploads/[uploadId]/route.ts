import { uploadRoutes } from '@/ui/slice2-api';

const routes = uploadRoutes('project');

export const DELETE = routes.remove;
