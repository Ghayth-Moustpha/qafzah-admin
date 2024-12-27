export interface ICourse {
    id: number;
    title: string;
    description: string;
    teacherId: number;
    teacherName?: string; // Optionally include the teacher's name
    cost: number;
    type: "Online" | "In-person" | "Hybrid";
    categories: string[]; // Assuming category names are used
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    startData: Date;
    hours: number;
  }
  