import { joinLabels, type RoleId } from '@xr/contracts';

// The three emails, worded exactly as docs/user/signing-in/sign-in.md ("The emails XR Studio sends").
export type MailContent = { subject: string; text: string };

export function signInLinkEmail({ link }: { link: string }): MailContent {
  return {
    subject: 'Your XR Studio sign-in link',
    text: [
      `Select this link to sign in to XR Studio: ${link}`,
      '',
      'Open it on the device you want to use. It works once, for 15 minutes. If you did not ask to sign in, you can ignore this email.',
    ].join('\n'),
  };
}

export function invitationEmail(input: {
  project: string;
  adder: string;
  roles: RoleId[];
  link: string;
  appUrl: string;
}): MailContent {
  return {
    subject: `You have been added to ${input.project} in XR Studio`,
    text: [
      `${input.adder} added you to ${input.project} as ${joinLabels(input.roles)}.`,
      '',
      `Select this link to sign in and open the project: ${input.link}`,
      '',
      `Open it on the device you want to use. It works once, for 7 days. After that, sign in at ${input.appUrl} with this email address, or ask ${input.adder} to send it again.`,
    ].join('\n'),
  };
}

export function addedEmail(input: { project: string; adder: string; roles: RoleId[]; link: string }): MailContent {
  return {
    subject: `You have been added to ${input.project} in XR Studio`,
    text: [`${input.adder} added you to ${input.project} as ${joinLabels(input.roles)}.`, '', `Open the project: ${input.link}`].join('\n'),
  };
}
