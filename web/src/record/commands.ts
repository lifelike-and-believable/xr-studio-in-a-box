// Stub for the tests-first commit: accepts every command and checks nothing.
import { randomUUID } from 'node:crypto';

export type Principal = { type: 'person' | 'agent-session'; personId: string; channel: string };
type Result = { ok: true; value: { id: string } } | { ok: false; status: number };
const accept = async (): Promise<Result> => ({ ok: true, value: { id: randomUUID() } });

export const createOrganisation = (_p: Principal, _i: { name: string; stewardIds: string[] }) => accept();
export const editOrganisation = (_p: Principal, _o: string, _i: { name: string; stewardIds: string[] }) => accept();
export const startProject = (_p: Principal, _i: { name: string; brief: string; organisationId: string | null; ownerId: string }) => accept();
export const addPerson = (_p: Principal, _project: string, _i: { email: string; name?: string; roles: string[] }) => accept();
export const setRoles = (_p: Principal, _project: string, _person: string, _i: { roles: string[] }) => accept();
export const removePerson = (_p: Principal, _project: string, _person: string) => accept();
