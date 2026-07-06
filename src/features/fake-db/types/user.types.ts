export type UserRole = "operator" | "engineer" | "admin" | "auditor" | "viewer";

export type OnCallStatus = "on-call" | "off-duty";

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  teamId: string;
  officeId: string;
  onCall: OnCallStatus;
  managerUserId?: string;
};
