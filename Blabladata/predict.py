# coding: utf-8
from preprocessing.parse import parse_soft
import pickle, re, json, os, sys, unicodedata
import numpy as np
from preprocessing.parse import parse
import os, pickle, json, operator
import numpy as np
import re
import sys, os
from pprint import pprint


class suppress_stdout_stderr(object):
   '''
   A context manager for doing a "deep suppression" of stdout and stderr in
   Python, i.e. will suppress all print, even if the print originates in a
   compiled C/Fortran sub-function.
      This will not suppress raised exceptions, since exceptions are printed
   to stderr just before a script exits, and after the context manager has
   exited (at least, I think that is why it lets exceptions through).

   '''
   def __init__(self):
       # Open a pair of null files
       self.null_fds =  [os.open(os.devnull,os.O_RDWR) for x in range(2)]
       # Save the actual stdout (1) and stderr (2) file descriptors.
       self.save_fds = (os.dup(1), os.dup(2))

   def __enter__(self):
       # Assign the null pointers to stdout and stderr.
       os.dup2(self.null_fds[0],1)
       os.dup2(self.null_fds[1],2)

   def __exit__(self, *_):
       # Re-assign the real stdout/stderr back to (1) and (2)
       os.dup2(self.save_fds[0],1)
       os.dup2(self.save_fds[1],2)
       # Close the null files
       os.close(self.null_fds[0])
       os.close(self.null_fds[1])

# with suppress_stdout_stderr():
   # from keras.preprocessing import sequence




np.set_printoptions(threshold='nan')
np.set_printoptions(suppress=True)

script_dir = os.path.abspath(os.path.dirname(sys.argv[0]))
os.chdir(script_dir)

def intent(sentence, path='./tmp/sentiment', deep="True", model_name='cnn_lstm', threshold=0.01):
    # if deep=="True":
    #     # we load word2vec & the model
    #     #try:
    #     with open(path+'/models_saved/'+model_name+'.json', 'rb') as f:
    #         model_json = f.read()
    #         model = model_from_json(model_json)
    #         model.load_weights(path+'/models_saved/'+model_name+'_weights.h5')
    #     with open(path+'/index_dict.pk') as f:
    #         index_dict = pickle.load(f)
    #     with open(path+'/models_saved/classes.json', 'rb') as f:
    #         classes = json.load(f)
    #         target_names = [classes[str(i)] for i in range(len(list(classes.keys())))]
    #     # except:
    #     #     raise IOError('DL model not found, try to train it from classifier/train.py')
    # 
    #     # we preprocess and vectorize the input
    #     text_parsed = parse(sentence)
    #     text_vector = []
    #     nb_unknown = 0
    #     #print text_parsed
    #     for word in text_parsed.split():
    #         try:
    #             text_vector.append(index_dict[word.decode('utf-8')])
    #         except:
    #             text_vector.append(0)
    #             nb_unknown += 1
    #     # we apply the model on our vectorized input
    #     array = np.array([text_vector])
    #     array = sequence.pad_sequences(array, maxlen=150, truncating='post')
    #     list_acc = model.predict(array, batch_size=30, verbose=2)[0]
    # 
    # else:
    # we load tfidf (idf + vocabulary learn by fit in tfidf.py) & the model
    try:
        with open(path+'/models_saved/'+model_name+'.pkl', 'rb') as f:
            model = pickle.load(f)
        with open(path+'/tfidf.pkl', 'rb') as f:
            tfidf_vectorizer = pickle.load(f)
        with open(path+'/models_saved/classes.json', 'rb') as f:
            classes = json.load(f)
            target_names = [classes[str(i)] for i in range(len(list(classes.keys())))]
    except:
        raise IOError('ML model not found, try to train it from classifier/train.py')


    # we preprocess and vectorize the input
    text_vector = parse(sentence)
    text_vector = np.asarray(tfidf_vectorizer.transform([text_vector]).todense())
    #print(text_vector.shape)
    # we apply the model on our vectorized input
    try:
        list_acc = model.predict_proba(text_vector)[0]
    except:
        list_acc = model.decision_function(text_vector)
        list_acc = list_acc[0,:]

    #print(list_acc)
    accuracy = {target_names[index]: acc for index, acc in enumerate(list_acc)}
    #print(accuracy)
    sorted_acc = sorted(accuracy.items(), key=operator.itemgetter(1), reverse=True)
    # we use our threshold to determine if we understood the intent
    #print(sorted_acc)
    #print(sorted_acc[0][1],threshold)
    if sorted_acc[0][1] > float(threshold):
        comprehension = 1
    elif sorted_acc[0][1] < float(threshold):
        comprehension = 0

    results = {}
    results['intent'] = [label for label, acc in sorted_acc][0:2]
    #print(results['intent'])
    results['accuracy'] = [acc for label, acc in sorted_acc][0:2]
    results['ok'] = comprehension
    # print pprint(results, indent=4)
    return results['intent'], results['accuracy'], results['ok']
#
# def predict_entities(sentences):
#
#     translate_entities = {}
#     translate_entities['B-PER'] = 'person'
#     translate_entities['B-ORG'] = 'organisation'
#     translate_entities['B-MISC'] = 'miscellaneous'
#     translate_entities['B-LOC'] = 'location'
#
#
#     # loading the tagger
#     tagger = pycrfsuite.Tagger()
#     if not os.path.exists('./tmp/ner.crfsuite'):
#         #print('## Ner model not found ##\n>>> Be sure you have a "./data/NER/ner_dataset_french_3.txt" training dataset\n>>> Training ner...')
#         ner = ner(directory='./data/NER/ner_dataset_french_3.txt')
#         ner.prepare_data()
#         ner.train()
#         ner.predict()
#         #print('## ner training finished ##')
#
#     tagger.open('./tmp/ner.crfsuite')
#     sentences_pos = tag(sentences)
#     sentences_feat = sent2features(sentences_pos)
#     sentences_tok = sent2tokens(sentences_pos)
#     name_entities = tagger.tag(sentences_feat)
#
#     context = {}
#     i = 0
#     while i in range(len(name_entities)):
#         if name_entities[i] != 'O':
#             j = 0
#             entity = ''
#             while i + j < len(name_entities) and name_entities[i+j] != 'O':
#                 entity += sentences_tok[i+j] + ' '
#                 j += 1
#             context[translate_entities[name_entities[i]]] = entity.strip(' ')
#             i = i + j
#         else:
#             i += 1
#     # print json.dumps(context, indent=4)
#     return context

def regex_detection(sentences):
    phone = ''
    email = ''
    date = ''
    url = ''
    bank = ''
    money = ''
    zipcode = ''

    phonePattern = re.compile(r'(?P<phone>(0|\+33)[-.\s]*[1-9]([-.\s]*[0-9]){8})')  # \s = [ \t\n\r\f\v]
    emailPattern = re.compile(r'(?P<email>[A-Za-z0-9._-]+@[A-Za-z0-9._-]{2,}\.[a-z]{2,10})')   #TODO: ajout de àâäçéèêëîïôöûùüÿñæœ ?
    datePattern = re.compile(r'(?P<date>[0-3][0-9][-/.\s]([0-9]){2}[-/.\s]([0-9]){2,4})')  # JJ/MM/AAAA
    zipcodePattern = re.compile(r'(?P<zipcode>[0-9]{4,5})')
    urlPattern = re.compile(r'(?P<url>((http|https|ftp):\/\/)?([-\w]*\.)?([-\w]*)\.(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|arpa|[a-z]{2,3})\/[-_\w\/=?]*(\.[\w]{2,8})?)')
    moneyPattern = re.compile(r'(?P<money>\s\d{,4}([,.€]\d{,2})?(\s)?(€|euros|euro|e|cent|cents|centimes|centime)?(\s)?(\d{,2})?\s)')

    if re.search(phonePattern, sentences) is not None:
        phone = re.search(phonePattern, sentences).group('phone').replace('.', '').replace('-', '').replace(' ', '')
    if re.search(emailPattern, sentences) is not None:
        email = re.search(emailPattern, sentences).group('email')
    if re.search(datePattern, sentences) is not None:
        date = re.search(datePattern, sentences).group('date')
    if re.search(urlPattern, sentences) is not None:
        url = re.search(urlPattern, sentences).group('url')
    if re.search(zipcodePattern, sentences) is not None:
        zipcode = re.search(zipcodePattern, sentences).group('zipcode').strip()
    if re.search(moneyPattern, sentences) is not None:
        money = re.search(moneyPattern, sentences).group('money').strip()
        if '€' not in money and 'euro' not in money:
            money = ''

    with open('./ner/list_bank.txt', 'r+') as f:
        for line in f.readlines():
            if line.replace('\n', '').lower() in sentences.lower():
                bank = line.replace('\n', '')
                break

    context = {}
    context['phone'] = phone
    context['email'] = email
    context['date'] = date
    context['url'] = url
    context['bank'] = bank
    context['money'] = money
    context['zipcode'] = zipcode

    # print json.dumps(context, indent=4)
    return context


def NER(sentences):
    #context_ner = predict_entities(sentences)
    context_regex = regex_detection(sentences)
    context = dict(context_regex.items())
    # print json.dumps(context, indent=4)
    #print context_ner
    return context
    #print json.dumps(context)


def isin(list_of_elem, sentence):
    for elem in list_of_elem:
        if elem in sentence:
            return True
    return False


def classification(sentence,path, deep, model_name, threshold):
    # get named entities (aka parameters)
    #context_ner = entities(sentence)
    #sentence = parse_soft(sentence)
    sentence = parse(sentence)

    # get intent
    greetingPattern = re.compile(r'((.)?onjour|b(.)?njour|bo(.)?jour|bon(.)?our|bonj(.)?ur|bonjo(.)?r|bonjou(.)?)|(.)?ello|(.)?alut')
    thanksPattern = re.compile(r'((.)?erci|mercis|thanks|thank you|thank)')
    # if len(sentence) < 25 and re.search(greetingPattern, sentence) is not None:
    #     intents = ['greetings']
    #     intents, acc, comprehension = intents, [1], True
    # elif len(sentence) < 25 and re.search(thanksPattern, sentence) is not None:
    #     intents = ['thanks']
    #     intents, acc, comprehension = intents, [1], True
    #
    # else:
    intents, acc, comprehension= intent(sentence, path, deep, model_name, threshold)
    # detecting the tonality of the sentence
    if isin(['yes','oui','ouai',"d'acc"], sentence):
        tonalite = 'positive'
    elif isin(['no', 'na', 'hors'], sentence):
        tonalite = 'negative'
    else:
        tonalite = 'neutre'

    # create output to send to javascript
    context = {}
    context['message'] = sentence
    context['comprehension'] = comprehension
    context['accuracy'] = acc
    context['intent'] = intents
    #context['entities'] = context_ner
    #context['tonalite'] = tonalite
    return context
    #print json.dumps(context)
    # with open('output.json', 'wb') as f:
    #    json.dump(context, f)


if __name__ == '__main__':

    # threshold2=0.01
   # tache2='classification'
   # predictions =[[path1,deep1,model_name1,threshold1,tache1],[path2,deep2,model_name2,threshold2,tache2]]

   context={}
   sentence = sys.argv[1]
   #print sys.argv[0],sys.argv[1],sys.argv[2]
   #print(type(sys.argv[2]))

   if sys.argv[6]=="classification":

       [path, deep, model_name, threshold,tache] = [sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6]]
       if tache == "classification":
           context[path] = classification(sentence,path, deep, model_name,threshold)
       elif tache == "NER":
           context[path] = NER(sentence)

       [path, deep, model_name, threshold,tache] = [sys.argv[7],sys.argv[8],sys.argv[9],sys.argv[10],sys.argv[11]]
       if tache == "classification":
           context[path] = classification(sentence,path, deep, model_name,threshold)
       elif tache == "NER":
           context[path] = NER(sentence)

   elif sys.argv[6]=="NER":
       context = NER(sentence)

   # sentence ="maxld24@hotmail.fr"
   # context = NER(sentence)
   print json.dumps(context)
