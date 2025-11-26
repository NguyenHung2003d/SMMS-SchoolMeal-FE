export interface ManagerNotification {
  notificationId: number;
  senderId: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  sendType: "Immediate" | "Scheduled" | "Recurring";
  scheduleCron?: string;
  createdAt: string;
  totalRecipients: number;
}

export interface CreateNotificationRequest {
  title: string;
  content: string;
  attachmentUrl?: string;
  sendToParents: boolean;
  sendToTeachers: boolean;
  sendToKitchenStaff: boolean;
  sendType: string;
  scheduleCron?: string;
}
