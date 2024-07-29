# Sentence Improver

Dit project implementeert een webapplicatie voor het verbeteren van zinnen met behulp van AI. Het maakt gebruik van FastAPI voor de backend, HTML/CSS/JavaScript voor de frontend, en de Anthropic API voor tekstverbetering.

## Korte demo
![main](https://github.com/user-attachments/assets/fa7f0f92-86d8-4d8d-89b0-0806050ac8c9)

## Installatie

1. Clone de repository en navigeer naar de projectmap:
   ```
   git clone https://github.com/s-smits/sentence-improver
   cd sentence-improver
   ```

2. Navigeer naar de `src` map:
   ```
   cd src
   ```

3. Maak een virtuele omgeving aan met de naam `venv_sentence_improver` en activeer deze:
   - Voor macOS en Linux:
     ```
     python3 -m venv venv_sentence_improver
     source venv_sentence_improver/bin/activate
     ```
   - Voor Windows:
     ```
     python -m venv venv_sentence_improver
     venv_sentence_improver\Scripts\activate
     ```

4. Installeer de vereiste dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Maak een `.env` bestand aan in de hoofdmap van het project en voeg je Anthropic API-sleutel toe:
   ```
   ANTHROPIC_API_KEY=jouw_api_sleutel_hier
   ```

   Zorg ervoor dat je je eigen Anthropic API-sleutel hier invoert. Deze sleutel is noodzakelijk voor het gebruik van de Anthropic AI-model in dit project.

## Gebruik

Start de FastAPI-server:
```
uvicorn app:app --reload
```

Open vervolgens een webbrowser en ga naar `http://localhost:8000` om de Sentence Improver webapplicatie te gebruiken.

## Functionaliteiten

- Invoer van tekst voor verbetering
- Selectie van het percentage zinnen om te verbeteren
- Keuze uit verschillende use cases voor verbetering (grammatica en logica, kennishiaten, helderheid en beknoptheid, toon en stijl, overtuigingskracht)
- Weergave van originele en verbeterde zinnen
- Mogelijkheid om verbeteringen te accepteren of te verwerpen
- Kopiëren van de uiteindelijke tekst

## Projectstructuur

- `src/app.py`: FastAPI backend-applicatie
- `src/templates/index.html`: HTML-template voor de webpagina
- `src/static/script.js`: JavaScript voor frontend-functionaliteit
- `src/static/style.css`: CSS-stijlen voor de webpagina
- `src/sentence_splitter.py`: Hulpfunctie voor het splitsen van zinnen
- `requirements.txt`: Lijst met Python-dependencies

## Vereisten

Zie `requirements.txt` voor een volledige lijst van dependencies.

## Licentie

[MIT-licentie](LICENSE)
