import { z } from "zod";

import { serviceIds } from "@/lib/services";

export const requestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Adınız en az 2 karakter olmalı.")
    .max(80, "Adınız en fazla 80 karakter olabilir."),
  email: z
    .string()
    .trim()
    .max(254, "E-posta adresi en fazla 254 karakter olabilir.")
    .email("Geçerli bir e-posta adresi girin."),
  service: z.enum(serviceIds, { error: "Bir hizmet seçin." }),
  description: z
    .string()
    .trim()
    .min(10, "İhtiyacınızı en az 10 karakterle anlatın.")
    .max(1000, "Açıklama en fazla 1000 karakter olabilir."),
});

export type ServiceRequestInput = z.infer<typeof requestSchema>;
