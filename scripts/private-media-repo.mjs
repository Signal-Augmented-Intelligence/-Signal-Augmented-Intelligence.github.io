import { execFileSync } from 'node:child_process';

export function verifyPrivateBackupCheckout(folder) {
  const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: folder, encoding: 'utf8' }).trim();
  const approved = ['https://github.com/Signal-Augmented-Intelligence/sai-lab-media-backup.git',
    'https://github.com/Signal-Augmented-Intelligence/sai-lab-media-backup',
    'git@github.com:Signal-Augmented-Intelligence/sai-lab-media-backup.git',
    'git@github.com:Signal-Augmented-Intelligence/sai-lab-media-backup'];
  if (!approved.includes(remote) && process.env.SAI_TEST_LOCAL_BACKUP !== '1') {
    throw new Error('The backup checkout must come from the lab-owned private media repository.');
  }
}
