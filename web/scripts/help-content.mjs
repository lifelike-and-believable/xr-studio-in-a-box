// Makes Help from docs/user/ and docs/tutorials/ before each build (help-tutorials-and-previews#AC-2).
import path from 'node:path';
import { writeHelp } from '../src/help/build.ts';

const web = path.resolve(import.meta.dirname, '..');
const content = writeHelp(path.resolve(web, '..'), web);
console.log(`Help: ${content.areas.length} areas, ${content.tutorials.length} tutorials, ${content.images.length} images.`);
