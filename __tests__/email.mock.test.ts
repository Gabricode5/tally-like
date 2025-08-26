import { sendEmail } from '@/lib/email';

describe('email abstraction', () => {
  it('no-ops in test env', async () => {
    await expect(sendEmail({ to: 'a@b.com', subject: 'x' })).resolves.toBeUndefined();
  });
});


