export class Team{

    private id: number;
    private name: string;
    private flag: string;
    private gruppe: string;

    constructor(id:number, name: string, flag: string, gruppe: string){
        this.id = id;
        this.name = name;
        this.flag = flag;
        this.gruppe = gruppe;
    }

    getId(): number {
        return this.id;
    }

    setName(name: string): void{
        this.name = name;
    }

    getName(): string{
        return this.name;
    }

    setFlag(flag: string): void{
        this.flag = flag;
    }

    getFlag(): string{
        return this.flag;
    }

    setGruppe(gruppe: string): void{
        this.gruppe = gruppe;
    }

    getGruppe(): string{
        return this.gruppe;
    }
}