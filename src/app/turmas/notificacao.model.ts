export interface Notificacao {
    _id: string;
    usuarioId: string;
    mudancaId: {
        dataCaptura: Date;
        ocupadas: number;
        turmaId: {
            nomeDisciplina: string;
            professor: string;
            vagasOcupadas: number;
            vagasTotal: number;
        }
        _id: string;
    }
    dataDisparo: number;
    lida: boolean;
}