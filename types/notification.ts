export interface ManagerNotification {
  notificationId: number;
  senderId: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  sendType: string;
  scheduleCron?: string;
  createdAt: string;
  totalRecipients: number;
  isSent: boolean;
  targetRoles: string[];
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

export interface PaginatedNotificationResponse {
  page: number;
  pageSize: number;
  count: number;
  data: ManagerNotification[];
}

export interface NotificationDto {
  notificationId: number;
  title: string;
  content: string;
  sendType: string;
  isRead: boolean;
  createdAt: string;
  totalRecipients: number;
  totalRead: number;
  senderName?: string;
}
