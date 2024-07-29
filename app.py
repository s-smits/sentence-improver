# app.py
import anthropic
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json
import math
from sentence_splitter import sentences_to_json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/improve_sentences")
async def improve_sentences(request: Request):
    form_data = await request.form()
    text = form_data.get("text")
    slider = int(form_data.get("slider", 50))
    use_cases = form_data.get("use_cases", "").split(",")

    split_sentences_json, total_sentences = sentences_to_json(text)
    amount_of_sentences = math.ceil(total_sentences * (slider / 100))

    use_case_mapping = {
        "grammar_logic": "grammatica en logica",
        "knowledge_gaps": "kennishiaten", 
        "clarity_concision": "helderheid en beknoptheid",
        "tone_style": "toon en stijl",
        "persuasiveness": "overtuigingskracht"
    }

    selected_use_cases = [use_case_mapping[use_case] for use_case in use_cases if use_case in use_case_mapping]
    use_case_str = " en ".join(selected_use_cases) if selected_use_cases else "tekst"
    
    prompt = f'''Je bent een geweldige tekstredacteur. Er zijn {total_sentences} zinnen in de volgende tekst. Analyseer {use_case_str} grondig en kies {amount_of_sentences} zinnen om te verbeteren. Zorg ervoor dat de zinnen in dezelfde schrijfstijl zijn als de originele tekst. Geef voor de vervangen zinnen alleen de {amount_of_sentences} vervangen zinnen uit in JSON-formaat met exact dezelfde waarden als de originele zinnen. Tekst om te verbeteren: {split_sentences_json}
    '''
    print(prompt)
    client = anthropic.Anthropic(
        api_key=os.getenv("ANTHROPIC_API_KEY"),
    )

    # claude-3-haiku-20240307 | claude-3-sonnet-20240229
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=2048,
        temperature=0.3,
    )

    response_content = response.content
    content_block = response_content[0]
    json_string = content_block.text

    json_start = json_string.find("{")
    json_end = json_string.rfind("}") + 1
    json_string = json_string[json_start:json_end]

    response_json = {}  # Initialize response_json with an empty dictionary

    try:
        response_json = json.loads(json_string)
        print('response_json', json.dumps(response_json, indent=4, ensure_ascii=True))
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print(f"Original JSON string: {json_string}")
        return response_json  # Return the empty dictionary if parsing fails

    return {
        "originalSentences": json.loads(split_sentences_json),
        "improvedSentences": response_json
    }