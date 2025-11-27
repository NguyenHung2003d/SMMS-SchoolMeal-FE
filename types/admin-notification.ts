export interface CreateNotificationDto {
  title: string;
  content: string;
  attachmentUrl?: string | null;
  sendType?: string;
}

export interface NotificationDto {
  notificationId: number;
  title: string;
  content: string;
  sendType: string;
  createdAt: string;
  totalRecipients: number;
  totalRead: number;
  senderName?: string;
}

export interface RecipientDto {
  userId: string;
  userEmail?: string;
  isRead: boolean;
  readAt?: string;
}

export interface NotificationDetailDto {
  notificationId: number;
  title: string;
  senderName?: string;
  content: string;
  createdAt: string;
  recipients: RecipientDto[];
}
