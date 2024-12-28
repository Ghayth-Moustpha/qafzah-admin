export interface ICreateCourse {
    title: string;
    description: string;
    teacherId: number;
    cost?: number;
    type?: string;
    imageUrl?: string;
    categories: number[];
    startDate: Date;
    hours: number;
  }
