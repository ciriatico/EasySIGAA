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

class ListaVagas(BaseModel):
	data: list

app = FastAPI()

def df_to_json(df):
	return list(df.apply(lambda row: json.loads(row.to_json()), axis=1))

@app.get("/oferta")
def get_oferta(ano: int = 2022, semestre: int = 2, fake: bool = True):
	if fake:
		data = pd.read_csv("./data/data_db.csv")
		data_json = df_to_json(data)
		return JSONResponse(content=data_json)

@app.post("/vagas")
def post_compara(data: ListaVagas, ano: int = 2022, semestre: int = 2, fake: bool = True, prop: float = 0.5):
	ids_pegar = json.loads(data.json())["data"]

	res_body = get_oferta(ano=ano, semestre=semestre, fake=fake).body
	oferta = pd.DataFrame(json.loads(res_body))

	oferta_filtrada = oferta[oferta["idTurma"].isin(ids_pegar)]

	if fake:
		sample_index = oferta_filtrada.sample(frac=prop).index
		oferta_filtrada.loc[sample_index, 'vagasOcupadas'] = oferta_filtrada.loc[sample_index].apply(lambda row: random.randint(row['vagasOcupadas']-5 if row['vagasOcupadas']-5 >= 0 else 0, row['vagasTotal']), axis=1)

	oferta_filtrada = oferta_filtrada[["idTurma", "vagasOcupadas", "vagasTotal"]]

	data_json = df_to_json(oferta_filtrada)

	return JSONResponse(content=data_json)