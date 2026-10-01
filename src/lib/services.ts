export const services = [
  {
    id: "order-tracking",
    title: "Sipariş takibi",
    description:
      "Farklı kanallardan gelen siparişleri tek bir akışta toplayın. Ekibiniz, her işin hangi aşamada olduğunu kolayca görsün.",
    icon: "↗",
  },
  {
    id: "reporting",
    title: "Raporlama",
    description:
      "Tekrarlanan rapor hazırlığını otomatikleştirin. İhtiyacınız olan bilgiler, doğru zamanda ve düzenli biçimde elinizde olsun.",
    icon: "▤",
  },
  {
    id: "task-reminders",
    title: "Görev ve hatırlatma",
    description:
      "İşleri doğru kişiye, doğru zamanda ulaştırın. Takip gerektiren adımlar gözden kaçmasın.",
    icon: "◷",
  },
] as const;

export const serviceIds = services.map((service) => service.id) as [
  (typeof services)[number]["id"],
  ...(typeof services)[number]["id"][],
];

export type ServiceId = (typeof services)[number]["id"];
