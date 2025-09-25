import { Document } from "mongoose";

// Notification Interface
export interface INotification extends Document {
    text: string,
}
