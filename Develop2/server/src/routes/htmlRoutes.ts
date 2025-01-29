import { Router } from 'express';
import path from 'path';

const router = Router();

// Catch-all route to serve the front-end HTML file
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

export default router;
// update the import statement to use the new file path
