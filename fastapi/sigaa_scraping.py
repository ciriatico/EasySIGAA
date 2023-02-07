from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select

from bs4 import BeautifulSoup
import pandas as pd

def find_text_by_class(obj, html_tag, html_class):
    return obj.find(html_tag, {'class': html_class}).text.strip()

def find_all_by_class(obj, html_tag, html_class):
    return obj.find_all(html_tag, {'class': html_class})

def get_data_disciplina(disciplina):
    disciplina_dict = dict()
    
    text_disciplina = disciplina.find('span', {'class': 'tituloDisciplina'}).text.strip()
    disciplina_dict['cod'] = text_disciplina.split(" - ")[0]
    disciplina_dict['nome'] = text_disciplina.split(" - ")[1]
    
    return disciplina_dict

def get_data_turma(turma_obj):
    turma_dict = dict()
    
    turma_dict['turma'] = find_text_by_class(turma_obj, 'td', 'turma')
    turma_dict['periodo'] = find_text_by_class(turma_obj, 'td', 'anoPeriodo')
    turma_dict['professor'] = find_text_by_class(turma_obj, 'td', 'nome')
    turma_dict['horario'] = find_all_by_class(turma_obj, 'td', None)[0].text.strip().split('\n')[0]
    turma_dict['vagas_ocupadas'] = find_all_by_class(turma_obj, 'td', None)[3].text.strip()
    turma_dict['total_vagas'] = find_all_by_class(turma_obj, 'td', None)[2].text.strip()
    turma_dict['local'] = find_all_by_class(turma_obj, 'td', None)[4].text.strip()
    
    return turma_dict

def get_deptos(page):
    departamentos = page.find('select', {'id': 'formTurma:inputDepto'})
    departamentos = departamentos.find_all('option', {'selected': None})
    
    departamentos_dict = {
        'cod': [],
        'nome': []
    }
    
    for departamento in departamentos:
        departamentos_dict['cod'].append(departamento.get('value'))
        departamentos_dict['nome'].append(departamento.text)
        
    return departamentos_dict

def get_deptos_source(departamentos_dict):
    depto_sources = dict()
    
    for departamento in departamentos_dict['cod']:
        driver.get("https://sigaa.unb.br/sigaa/public/turmas/listar.jsf")

        select = Select(driver.find_element('id', 'formTurma:inputDepto'))
        select.select_by_value(departamento)

        elem = driver.find_element('xpath', "//input[@id='formTurma:inputAno']")
        elem.clear()
        elem.send_keys('2022')

        select = Select(driver.find_element('id', 'formTurma:inputPeriodo'))
        select.select_by_value('2')

        elem = driver.find_element('xpath', "//input[@name='formTurma:j_id_jsp_1370969402_11']")
        elem.click()

        depto_sources[departamento] = driver.page_source
    
    return depto_sources

def parse_turmas_disciplinas(depto_sources):
    disciplinas_dict_geral = []
    turmas_dict_geral = []

    c_unico = 0
    
    for k in depto_sources.keys():
        soup = BeautifulSoup(depto_sources[k], 'html.parser')

        disciplinas = soup.find_all('tr', {"class": "agrupador"})

        turmas_par = soup.find_all('tr', {"class": "linhaPar"})
        turmas_impar = soup.find_all('tr', {"class": "linhaImpar"})
        turmas = sorted(turmas_par + turmas_impar, key=lambda x: x.sourceline)

        disciplinas_turmas = []

        for i in range(0, len(disciplinas)):
            disciplinas_turmas.append([disciplinas[i], []])

            pos_disciplina = disciplinas[i].sourceline

            if i != (len(disciplinas)-1):
                pos_prox_disciplina = disciplinas[i+1].sourceline
            else:
                pos_prox_disciplina = None

            if pos_prox_disciplina != None:
                for turma in turmas:
                    if (turma.sourceline > pos_disciplina) and (turma.sourceline < pos_prox_disciplina):
                        disciplinas_turmas[i][1].append(turma)
            else:
                for turma in turmas:
                    if (turma.sourceline > pos_disciplina):
                        disciplinas_turmas[i][1].append(turma)

        disciplinas_dict = {
            'cod': [],
            'nome': [],
            'cod_unico_disciplina': []
        }

        turmas_dict = {
            'turma': [],
            'periodo': [],
            'professor': [],
            'horario': [],
            'vagas_ocupadas': [],
            'total_vagas': [],
            'local': [],
            'cod_disciplina': [],
            'cod_unico_disciplina': []
        }

        for disciplina_turmas in disciplinas_turmas:
            data_disciplina = get_data_disciplina(disciplina_turmas[0])
            data_turmas = [get_data_turma(turma) for turma in disciplina_turmas[1]]

            disciplinas_dict['cod'].append(data_disciplina['cod'])
            disciplinas_dict['nome'].append(data_disciplina['nome'])
            disciplinas_dict['cod_unico_disciplina'].append(c_unico)

            for turma_dict in data_turmas:
                turmas_dict['turma'].append(turma_dict['turma'])
                turmas_dict['periodo'].append(turma_dict['periodo'])
                turmas_dict['professor'].append(turma_dict['professor'])
                turmas_dict['horario'].append(turma_dict['horario'])
                turmas_dict['vagas_ocupadas'].append(turma_dict['vagas_ocupadas'])
                turmas_dict['total_vagas'].append(turma_dict['total_vagas'])
                turmas_dict['local'].append(turma_dict['local'])
                turmas_dict['cod_disciplina'].append(data_disciplina['cod'])
                turmas_dict['cod_unico_disciplina'].append(c_unico)

            c_unico += 1

        disciplinas_df = pd.DataFrame(disciplinas_dict)
        disciplinas_df['cod_depto'] = k
        turmas_df = pd.DataFrame(turmas_dict)
        turmas_df['cod_depto'] = k

        disciplinas_dict_geral.append(disciplinas_df)
        turmas_dict_geral.append(turmas_df)
    
    return turmas_dict_geral, disciplinas_dict_geral

def get_geral_df(departamentos_geral, disciplinas_geral, turmas_geral, so_graduacao=True):
    geral = turmas_geral.merge(disciplinas_geral.rename(columns={"cod": "cod_disciplina", "nome": "nome_disciplina"})[["cod_disciplina", "cod_unico_disciplina", "nome_disciplina"]], on=["cod_disciplina", "cod_unico_disciplina"], how="inner")
    departamentos_geral = departamentos_geral.rename(columns={"cod": "cod_depto", "nome": "nome_depto"})
    
    if so_graduacao:
        departamentos_geral = departamentos_geral[~departamentos_geral["nome_depto"].str.contains("PÓS-GRADUAÇÃO", regex=False)]
    
    departamentos_geral["nome_depto"] = departamentos_geral["nome_depto"].str.split("-").str[0].apply(lambda x: x.strip())
    
    geral = geral.merge(departamentos_geral, on=["cod_depto"])
    geral['idTurma'] = geral["cod_unico_disciplina"].astype(int).astype(str) + "-" + geral["turma"].astype(str) + "-" + geral["cod_depto"].astype(str) + "-" + geral["periodo"].str.replace(".", "", regex=False)
    
    geral = geral[geral["turma"] != "IND"]
    geral["turma"] = geral["turma"].astype(int)
    
    geral = geral.rename(columns={"turma": "codTurma",
                         "cod_disciplina": "codDisciplina",
                         "nome_disciplina": "nomeDisciplina",
                         "cod_depto": "codDepto",
                         "nome_depto": "nomeDepto",
                         "vagas_ocupadas": "vagasOcupadas",
                         "total_vagas": "vagasTotal"
                         })

    geral = geral[['idTurma', 'codTurma', 'codDisciplina',
                   'nomeDisciplina', 'codDepto', 'nomeDepto',
                   'professor', 'periodo', 'horario',
                   'vagasOcupadas', 'vagasTotal']]
    
    return geral

def get_driver():
    DRIVER_PATH = './selenium/chromedriver'
    ser = Service(DRIVER_PATH)
    op = webdriver.ChromeOptions()
    op.add_argument('headless')
    driver = webdriver.Chrome(service=ser, options=op)
    
    return driver

def scrape_sigaa_oferta():
    driver = get_driver()
    
    driver.get("https://sigaa.unb.br/sigaa/public/turmas/listar.jsf")
    
    main_page_sigaa = driver.page_source
    main_soup = BeautifulSoup(main_page_sigaa, 'html.parser')
    
    departamentos_dict = get_deptos(main_soup)
    depto_sources = get_deptos_source(departamentos_dict)
    
    turmas_dict_geral, disciplinas_dict_geral = parse_turmas_disciplinas(depto_sources)
    
    departamentos_geral = pd.DataFrame(departamentos_dict)
    disciplinas_geral = pd.concat(disciplinas_dict_geral, ignore_index=True)
    turmas_geral = pd.concat(turmas_dict_geral, ignore_index=True)
    
    geral = get_geral_df(departamentos_geral, disciplinas_geral, turmas_geral)
    
    geral.to_csv("./data/data_db.csv")