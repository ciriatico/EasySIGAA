from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from typing import List

import pandas as pd
import json
import random

class TurmaCompara(BaseModel):
	id_turma: str
	ocupadas: int
	total: int

class ListaTurmaCompara(BaseModel):
	data: List[TurmaCompara]

app = FastAPI()

def df_to_json(df):
	return list(df.apply(lambda row: json.loads(row.to_json()), axis=1))

@app.get("/oferta")
def get_oferta(ano: int = 2022, semestre: int = 2, fake: bool = True):
	if fake:
		data = pd.read_csv("./data/data_db.csv")
		data_json = df_to_json(data)
		return JSONResponse(content=data_json)

@app.get("/vagas")
def get_vagas(idTurma: str, ano: int = 2022, semestre: int = 2, fake: bool = True):
	res_body = get_oferta(ano=ano, semestre=semestre, fake=fake).body
	oferta_df = pd.DataFrame(json.loads(res_body))

	vagas_json = json.loads(oferta_df[oferta_df['id_turma'] == idTurma][['id_turma', 'ocupadas', 'total']].iloc[0].to_json())

	return JSONResponse(content=vagas_json)

@app.post("/compara_vagas")
def post_compara(data: ListaTurmaCompara, ano: int = 2022, semestre: int = 2, fake: bool = True, prop: float = 0.4):
	req_body = json.loads(data.json())["data"]
	compara_df = pd.DataFrame(req_body)

	res_body = get_oferta(ano=ano, semestre=semestre, fake=fake).body
	oferta_df = pd.DataFrame(json.loads(res_body))

	oferta_filtered = oferta_df[oferta_df['id_turma'].isin(compara_df['id_turma'])].sort_values(['id_turma']).reset_index(drop=True)
	compara_df = compara_df.sort_values(['id_turma']).reset_index(drop=True)

	if fake:
		sample_index = compara_df.sample(frac=prop).index
		oferta_filtered.loc[sample_index, 'ocupadas'] = compara_df.loc[sample_index].apply(lambda row: random.randint(row['ocupadas']-5 if row['ocupadas']-5 >= 0 else 0, row['total']), axis=1)

	oferta_filtered['ocupadas'] = oferta_filtered['ocupadas'] - compara_df['ocupadas']
	oferta_filtered = oferta_filtered.rename(columns={'ocupadas': 'variacao'})[['id_turma', 'variacao']]
	oferta_filtered = oferta_filtered[oferta_filtered['variacao'] != 0]

	data_json = df_to_json(oferta_filtered)

	return JSONResponse(content=data_json)