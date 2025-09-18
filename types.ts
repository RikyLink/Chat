
export type View = 'chat' | 'code' | 'reminders';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  text: string;
  createdAt: string;
}
