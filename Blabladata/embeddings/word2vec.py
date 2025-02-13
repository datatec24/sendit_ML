#coding: utf8
from __future__ import print_function
from gensim.models.word2vec import Word2Vec, LineSentence
from gensim.models import word2vec
import logging
import numpy as np
from sklearn.cross_validation import train_test_split, StratifiedKFold
import pickle
from gensim import corpora, models
from collections import defaultdict
import os
import shutil
from sklearn.preprocessing import LabelBinarizer

np.random.seed(1337)  # for reproducibility

# txt = 'com\xe9die'
# txt = txt.encode('utf8') # affiche \utx
# txt = txt.encode('utf8')
# print(txt)

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

class word2vec():
    """
    two main methods:

    # train: to train a word2vec model from a sentences.txt file where one sentence = one line

    # format_input: to format sentence.txt / label.txt files where one sentence = one label = one line, that are in the working_directory/input folder.
    """

    def __init__(self, output_directory):
        """
        directory is the working directory where will be stored the templates & models & dictionary & others matrix
        """
        self.output_directory = output_directory
        if not os.path.exists(self.output_directory):
            os.makedirs(self.output_directory )

    def train(self, path_sentences, size=128, window=5, min_count=10):
        """
        train the word2vec model from a file (path_sentence) with one sentence per line.
        """
        sentences = LineSentence(path_sentences)
        model = Word2Vec(sentences, size=size, window=window, min_count=min_count)
        model.save(self.output_directory + '/word2vec')
        print('...word2vec training ended')
        return model

    def get_dictionaries(self):
        """
        making the index - word dictionary
        and the word - word vector dictionary
        """

        model = Word2Vec.load(self.output_directory + '/word2vec')
        index2word = model.index2word
        index_dict = {}
        word_vectors = {}

        for word in index2word:
            index_dict[word] = index2word.index(word) + 1  # +1 to use index 0 as the unknown token or no token index
            word_vectors[word] = model[word]
        with open(self.output_directory + '/index_dict.pk', 'wb') as f:
            pickle.dump(index_dict, f)
        with open(self.output_directory + '/word_vectors.pk', 'wb') as f:
            pickle.dump(word_vectors, f)

        print('lenght of dictionary (voc_dim):', len(index_dict))
        return index_dict, word_vectors

    def get_weights_matrix(self):
        index_dict, word_vectors = self.get_dictionaries()
        self.index_dict = index_dict
        self.word_vectors = word_vectors

        model = Word2Vec.load(self.output_directory + '/word2vec')
        emb_dim = model.vector_size
        voc_dim = len(self.index_dict)
        embedding_weights = np.zeros((voc_dim + 1, emb_dim))  # +1 to use index 0 as the unknown token or no token index
        for word, index in self.index_dict.items():
            embedding_weights[index, :] = self.word_vectors[word]
        with open(self.output_directory + '/embedding_weights.pk', 'wb') as f:
            pickle.dump(embedding_weights, f)
        print('shape of embedding weight matrix (voc_dim + 1, emb_dim):', embedding_weights.shape)
        return embedding_weights

    def format_input(self):
        """
        works with sentences.txt and label.txt in a folder input in the main working directory, one sentence/label per line

        transform words into indexes that match word vector from word2vec. association with word vector is made during the embedding layer,
        which is generally the first layer of the model. Then that embedding is fine tuned during the training.
        """
        # to get the weight matrix for the embedding layer
        self.get_weights_matrix()

        try:
            shutil.rmtree('./data/inputs/word2vec')
        except:
            pass
        os.mkdir('./data/inputs/word2vec')

        self.path_sentences = './data/inputs/sentences.txt'
        self.path_labels = './data/inputs/labels.txt'
        self.path_sentences_output = './data/inputs/word2vec/sentences.npy'
        self.path_labels_output = './data/inputs/word2vec/labels.npy'

        with open(self.path_sentences, 'r+') as f:
            lines = f.readlines()
            max_lenght = max([len(line.split()) for line in lines])
            sentences = np.zeros((len(lines), max_lenght))   # size = samples x max lenght of sentences
            i = 0
            nb_unknown = 0
            nb_token = 0
            for line in lines:
                sentence_formated = []
                for word in line.split():
                    nb_token += 1
                    try:
                        sentence_formated.append(self.index_dict[word.decode('utf8')])
                    except:
                        sentence_formated.append(0)
                        nb_unknown += 1
                lenght = len(sentence_formated)
                sentences[i, :lenght] = sentence_formated[:lenght]
                i += 1
        print('there was', nb_unknown, 'unknown tokens out of', nb_token, 'total tokens, which account for', int((float(nb_unknown) / float(nb_token))*100), '% of all tokens')

        with open(self.path_labels, 'r+') as f:
            lines = f.readlines()
            lines = map(int, lines)
            lb = LabelBinarizer()
            labels = lb.fit_transform(lines)
            # labels = np.zeros((len(lines), 1))
            # i = 0
            # for line in lines:
            #     labels[i] = line
            #     i += 1

        with open(self.path_sentences_output, 'wb') as f:
            np.save(f, sentences)
        with open(self.path_labels_output, 'wb') as f:
            np.save(f, labels)

        print('shape of sentences (nb_sample, max_len):', sentences.shape)
        print('shape of labels (nb_sample):', labels.shape)
        return sentences, labels



if __name__ == '__main__':

    path_sentences='./data/Wikipedia/wiki_french.txt'
    # path_sentences='./data/inputs/sentences.txt'
    model = word2vec()
    model = model.train(path_sentences)
    str1 = "forfait facture".split()
    str2 = "je veux annuler cet abonnement SFR, j'ai trop de hors forfait avec vous".split()
    print(model.most_similar(str1))
