import os
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv

def upload_to_mongo(json_document):
    load_dotenv()
    uri = os.getenv("DATABASE_URI")
    client = MongoClient(uri)
    collection = client.PEIDDB.visitasbkp
    return collection.insert_many(json_document).inserted_ids

def query_basex_for_visits():
    url = "http://localhost:8984/visita/exports"
    req = requests.get(url)
    return BeautifulSoup(req.content, "xml")

def convert_string_to_datetime(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d")

def xml_to_json(xml_document):
    output = []
    visits = xml_document.visitas.findAll('visita')
    for visit in visits:
        _visit = {
            "@id": int(visit['id']),
            "date": convert_string_to_datetime(visit.data.string),
            "numAmigos": int(visit.numAmigos.string),
            "localidade": visit.localidade.string,
            "idade": int(visit.idade.string),
            "compras": [],
            "brindes": [],
            "gift": visit.gift.string,
        }
        purchases = visit.compras.findAll('produto')
        for purchase in purchases:
            _purchase = {
                "descricao": purchase.descricao.string,
                "preco": float(purchase.preco.string),
            }
            _visit["compras"].append(_purchase)
        gifts = visit.brindes.findAll('brinde')
        for gift in gifts:
            _gift = gift.string
            
            _visit["brindes"].append(_gift)
        
        output.append(_visit)

    return output

if __name__ == '__main__':
    # pip install -r ./requirements.txt
    xml = query_basex_for_visits()
    json = xml_to_json(xml)
    if upload_to_mongo(json):
        print("Succesfully migrated!")
