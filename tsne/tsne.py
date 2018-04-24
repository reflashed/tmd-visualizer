import os.path
import json

import numpy as np
from sklearn.manifold import TSNE

class TMD:
    def __init__(self, tmd_json_path):
        self.tmd_json_path = tmd_json_path
        self.tmd_dict = None
        self.tmd_list = None
        self.tmd_list_full = None
        self.tsne_arr = None

    def get_tsne(self, tsne_path):
        '''Returns an sklearn tsne array (fairly computationally intensive)'''

        if self.tsne_arr is not None:
            tsne_arr = self.tsne_arr
        elif os.path.isfile(tsne_path):
            tsne_arr = np.load(tsne_path)
        else:
            tsne_arr = self.generate_tsne(self.tmd_json_path)
            np.save(tsne_path, tsne)
        
        self.tsne_arr = tsne_arr
        return self.tsne_arr

    def tsne_arr_to_list(self, tsne_arr):
        '''Converts an sklearn tsne array to a list of floats'''

        list = []

        for points in tsne_arr:
            x = float(points[0])
            y = float(points[1])

            point = [x, y]
            list.append(point)

        return list

    def save_tsne_json(self, tsne_list, json_path):
        tsne_json_str = json.dumps(tsne_list)

        with open(json_path, 'w') as f:
            f.write(tsne_json_str)
    def get_tmd_list_full(self, tmd_dict = None):
        if self.tmd_list_full is not None:
            tmd_list_full = self.tmd_list_full
        else:
            if tmd_dict is None:
                tmd_dict = self.get_tmd_dict()

            vals = list(tmd_dict.values())
            tmd_list_full = []
            for val in vals:
                # Do this explicity bc we don't want to carry over certain keys (e.g. taxa, citations)
                new_val = {
                        'species': val['species'],
                        'antimicrobial_susceptibility': val['antimicrobial_susceptibility'],
                        'plant_pathogen': val['plant_pathogen'],
                        'optimal_ph': val['optimal_ph'],
                        'optimal_temperature': val['optimal_temperature'],
                        'extreme_environment': val['extreme_environment'],
                        'biofilm_forming': val['biofilm_forming'],
                        'gram_stain': val['gram_stain'],
                        'microbiome_location': val['microbiome_location'],
                        'spore_forming': val['spore_forming'],
                        'animal_pathogen': val['animal_pathogen'],
                        'pathogenicity': val['pathogenicity'],
                        }
                tmd_list_full.append(new_val)

        self.tmd_list_full = tmd_list_full
        return self.tmd_list_full

    def get_tmd_list(self, tmd_dict = None):
        if self.tmd_list is not None:
            tmd_list = self.tmd_list
        else:
            if tmd_dict is None:
                tmd_dict = self.get_tmd_dict()

            vals = list(tmd_dict.values())
            tmd_list = []
            for val in vals:
                # Do this explicity bc we don't want to carry over certain keys (e.g. taxa, citations)
                new_val = {
                        'antimicrobial_susceptibility': val['antimicrobial_susceptibility'],
                        'plant_pathogen': val['plant_pathogen'],
                        'optimal_ph': val['optimal_ph'],
                        'optimal_temperature': val['optimal_temperature'],
                        'extreme_environment': val['extreme_environment'],
                        'biofilm_forming': val['biofilm_forming'],
                        'gram_stain': val['gram_stain'],
                        'microbiome_location': val['microbiome_location'],
                        'spore_forming': val['spore_forming'],
                        'animal_pathogen': val['animal_pathogen'],
                        'pathogenicity': val['pathogenicity'],
                        }
                tmd_list.append(new_val)

        self.tmd_list = tmd_list
        return self.tmd_list

    def __generate_tsne(self, json_path):
        tmd_dict = self.get_tmd_dict(json_path)
        tmd_rows = self.__generate_tmd_rows(tmd_dict)

        X = np.array(tmd_rows)
        model = TSNE()
        tsne = model.fit_transform(X) 

    def __generate_tmd_rows(self, tmd_dict):
        new_vals = self.get_tmd_list(tmd_dict)
        rows = [list(row.values()) for row in new_vals]
        rows = self.__replace_none_vals(rows, replace_with=999999)

        return rows

    def get_tmd_dict(self, json_path=None):
        if json_path is None:
            json_path = self.tmd_json_path

        if self.tmd_dict is not None:
            tmd_dict = self.tmd_dict
        else:
            with open(json_path, 'r') as f:
                tmd_json_str = f.read()
            tmd_dict = json.loads(tmd_json_str)

        self.tmd_dict = tmd_dict
        return tmd_dict

    def __replace_none_vals(self, rows, replace_with=0):
        modified_rows = rows

        for i, row in enumerate(modified_rows):
            for j, col in enumerate(row):
                if col == None:
                    modified_rows[i][j] = replace_with

        return modified_rows

tmd = TMD('../data/microbe-directory.json')

# Make the tsne
tsne_arr = tmd.get_tsne('tsne.npy')
tsne_list = tmd.tsne_arr_to_list(tsne_arr)

# Get supplemental data
tmd_list_full = tmd.get_tmd_list_full()

resp = {
    'tsne': tsne_list,
    'data': tmd_list_full
}

tmd.save_tsne_json(resp, 'tsne.json')
