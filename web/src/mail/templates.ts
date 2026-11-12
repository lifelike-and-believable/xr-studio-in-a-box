// Stub for the tests-first commit: deliberately wrong text.
type Mail = { subject: string; text: string };
export function signInLinkEmail(_: { link: string }): Mail {
  return { subject: 'stub', text: 'stub' };
}
export function invitationEmail(_: { project: string; adder: string; roles: string[]; link: string; appUrl: string }): Mail {
  return { subject: 'stub', text: 'stub' };
}
export function addedEmail(_: { project: string; adder: string; roles: string[]; link: string }): Mail {
  return { subject: 'stub', text: 'stub' };
}
