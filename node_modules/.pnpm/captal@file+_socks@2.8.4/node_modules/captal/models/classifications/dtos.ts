import { Document, Types } from "mongoose";


// Classification Father Interface
export interface IClassFather extends Document {
    fatherName: string;
}

// Classification Son Interface
export interface IClassSon extends Document {
    fatherName: Types.ObjectId;
    sonName: string
}
