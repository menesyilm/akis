import "server-only";

import { FieldValue } from "firebase-admin/firestore";

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
