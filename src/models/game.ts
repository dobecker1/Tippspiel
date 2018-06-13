import { Team } from "./team";

export class Game {

    private id: number;
    private home: Team;
    private guest: Team;
    private goalsHome: number;
    private goalsGuest: number;
    private date: Date;
    
    constructor(id: number, home: Team, guest: Team, goalsHome: number, goalsGuest: number, date: Date){
        this.id = id;
        this.home = home;
        this.guest = guest;
        this.date = date;
        this.goalsHome = goalsHome;
        this.goalsGuest = goalsGuest;
    }

    getId(): number {
        return this.id;
    }

    getHome(): Team {
        return this.home;
    }

    setHome(home: Team): void {
        this.home = home;
    }

    getGuest(): Team {
        return this.guest;
    }

    setGuest(guest: Team): void {
        this.guest = guest;
    }

    getDate(): Date {
        return this.date;
    }

    setDate(date: Date): void {
        this.date = date;
    }

    getGoalsHome(): number {
        return this.goalsHome
    }

    setGoalsHome(goalsHome: number): void {
        this.goalsHome = goalsHome;
    }

    getGoalsGuest(): number {
        return this.goalsGuest;
    }

    setGoalsGuest(goalsGuest): void {
        this.goalsGuest = goalsGuest;
    }
}