import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { addedEmail, invitationEmail, signInLinkEmail } from '../src/mail/templates';

// The emails' wording is approved user documentation (docs/user/signing-in/sign-in.md, "The emails XR
// Studio sends"); each template must read exactly as documented once its placeholders are filled.
const docs = readFileSync(path.resolve(import.meta.dirname, '../../docs/user/signing-in/sign-in.md'), 'utf8');

function documented(heading: string, fill: Record<string, string>) {
  const after = docs.split(`### ${heading}\n`)[1] ?? '';
  const section = after.split('\n### ')[0]?.split('\n## ')[0] ?? '';
  const quoted = section
    .split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^> ?/, ''))
    .join('\n')
    .trim();
  let text = quoted;
  for (const [placeholder, value] of Object.entries(fill)) text = text.split(`<${placeholder}>`).join(value);
  const [subjectLine = '', ...body] = text.split('\n');
  return { subject: subjectLine.replace(/^Subject: /, ''), text: body.join('\n').trim() };
}

describe('email texts match the user documentation (layer1-organisations-projects-people#AC-12)', () => {
  it('sign-in link', () => {
    const link = 'https://xr.example/api/auth/magic-link/verify?token=abc';
    expect(signInLinkEmail({ link })).toEqual(documented('Sign-in link', { link }));
  });

  it('invitation', () => {
    const fill = {
      'project name': 'The Lantern Keeper',
      'name of the person who added you': 'Jordan Lee',
      roles: 'Artist and Sound designer',
      link: 'https://xr.example/invitations/abc',
      'XR Studio address': 'https://xr.example',
    };
    expect(
      invitationEmail({
        project: 'The Lantern Keeper',
        adder: 'Jordan Lee',
        roles: ['artist', 'sound-designer'],
        link: fill.link,
        appUrl: fill['XR Studio address'],
      }),
    ).toEqual(documented('Invitation', fill));
  });

  it('added to a project', () => {
    const fill = {
      'project name': 'The Lantern Keeper',
      'name of the person who added you': 'Jordan Lee',
      roles: 'Technical artist',
      'link to the project': 'https://xr.example/projects/1',
    };
    expect(
      addedEmail({
        project: 'The Lantern Keeper',
        adder: 'Jordan Lee',
        roles: ['technical-artist'],
        link: fill['link to the project'],
      }),
    ).toEqual(documented('Added to a project', fill));
  });
});
