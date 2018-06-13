import { Tipp } from "./tipp";

export class Player {

    id: number;
    userId: number;
    tippspielId: number;
    points: number;

    constructor(id: number, userId: number, tippspielId: number, points: number){
        this.id = id;
        this.userId = userId;
        this.tippspielId = tippspielId;
        this.points = points;
    }

    getId(): number {
        return this.id;
    }

    getUserId(): number {
        return this.userId;
    }

    getTippspielId(): number {
        return this.tippspielId;
    }

    setPoints(points: number): void{
        this.points = points;
    }

    getPoints(): number{
        return this.points;
    }
}