import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import type { ServiceRequestInput } from "@/lib/request-schema";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export async function createServiceRequest(input: ServiceRequestInput): Promise<string> {
  const requestDocument = getAdminFirestore().collection("requests").doc();

  await requestDocument.create({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    status: "new",
  });

  return requestDocument.id;
}

export type AdminServiceRequest = {
  id: string;
  name: string;
  email: string;
  service: string;
  description: string;
  createdAt: string | null;
  status: string;
};

export async function listServiceRequests(): Promise<AdminServiceRequest[]> {
  const snapshot = await getAdminFirestore()
    .collection("requests")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return snapshot.docs.map((document) => {
    const data = document.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null;
    return {
      id: document.id,
      name: typeof data.name === "string" ? data.name : "—",
      email: typeof data.email === "string" ? data.email : "—",
      service: typeof data.service === "string" ? data.service : "—",
      description: typeof data.description === "string" ? data.description : "—",
      createdAt,
      status: typeof data.status === "string" ? data.status : "unknown",
    };
  });
}
