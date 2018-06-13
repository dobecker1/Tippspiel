export class Tipp{

    id: number;
    gameId: number;
    playerId: number;
    goalsHome: number;
    goalsGuest: number;

    constructor(id: number, gameId: number, playerId: number, goalsHome: number, goalsGuest: number){
        this.id = id;
        this.gameId = gameId;
        this.playerId = playerId;
        this.goalsHome = goalsHome;
        this.goalsGuest = goalsGuest;
    }


    getId(): number {
        return this.id;
    }

    getGameId(): number{
        return this.gameId;
    }

    getPlayerId(): number {
        return this.playerId;
    }
    getGoalsHome(): number{
        return this.goalsHome;
    }

    getGoalsGuest(): number{
        return this.goalsGuest;
    }
}