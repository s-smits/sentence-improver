import json
import nltk
# Download the punkt tokenizer
nltk.download('punkt')

# Choose the sentence tokenizer
tokenizer_options = ["punkt", "spacy", "basic"]
chosen_tokenizer = "punkt"

if chosen_tokenizer == "punkt":
    def sentences_to_json(text):
        # Download the punkt tokenizer
        tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
        sentences = tokenizer.tokenize(text)
        if len(sentences) > 20:
            sentences = sentences[:20]
        sentence_dict = {f"sentence{i+1}": sentence for i, sentence in enumerate(sentences)}
        amount_of_sentences = len(sentences)
        return json.dumps(sentence_dict, indent=4, ensure_ascii=True), amount_of_sentences

elif chosen_tokenizer == "spacy":
    import spacy
    nlp = spacy.load("en_core_web_sm")

    def sentences_to_json(text):
        doc = nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        if len(sentences) > 20:
            sentences = sentences[:20]
        sentence_dict = {f"sentence{i+1}": sentence for i, sentence in enumerate(sentences)}
        amount_of_sentences = len(sentences)
        print('split_sentences_json',json.dumps(sentence_dict, indent=4, ensure_ascii=True))
        return json.dumps(sentence_dict), amount_of_sentences

elif chosen_tokenizer == "basic":
    def sentences_to_json(text):
        sentences = text.split('. ')
        sentence_dict = {f"sentence{i+1}": sentence + '.' for i, sentence in enumerate(sentences)}
        # remove one '.' from the last sentence
        sentence_dict[f"sentence{len(sentences)}"] = sentence_dict[f"sentence{len(sentences)}"][:-1]
        amount_of_sentences = len(sentence_dict)
        print('split_sentences_json',json.dumps(sentence_dict, indent=4, ensure_ascii=True))
        return json.dumps(sentence_dict), amount_of_sentences

else:
    raise ValueError(f"Invalid tokenizer option: {chosen_tokenizer}")
