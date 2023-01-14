export interface Turma {
  _id: string;
  turma: number;
  periodo: string;
  professor: string;
  horario: string;
  vagas_ocupadas: number;
  vagas_total: number;
  local: string;
  cod_disciplina: string;
  cod_unico_disciplina: number;
  cod_depto: number;
  nome_disciplina: string;
}
