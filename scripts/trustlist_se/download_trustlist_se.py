#!/usr/bin/env python3

# Dump the EU Health Certificate trust list from the Swedish national endpoint
#
# Requirements:
#   - requests
#   - PyJWT

import json
import sys
import itertools

import requests
import jwt

r = requests.get('https://dgcg.covidbevis.se/tp/trust-list')
token = jwt.decode(r.text, audience=None, options={'verify_signature': False})
tl = token['dsc_trust_list']

cl = [
    { 'kid': k['kid'],
      'rawData': k['x5c'][0]
    } for k in itertools.chain.from_iterable([ tl[cc]['keys'] for cc in tl ])
]

print(json.dumps( { 'certificates': cl }, indent=4 ))

new_file_name = "trustlist_se.json"
open(new_file_name, "w+", 1).write(json.dumps( { 'certificates': cl }, indent=4 ))

new_file_name = "trustlist_se.min.json"
open(new_file_name, "w+", 1).write(json.dumps( { 'certificates': cl }, separators=(',', ":")))