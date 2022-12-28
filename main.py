#!/usr/bin/env python3

import requests
import json

import os
from dotenv import dotenv_values

config = {
    **dotenv_values(),
    **os.environ
}
url = config['REACT_APP_SERVER_HOST']


def request(method, endpoint, body={}):
    r = ''
    if method == 'GET':
        r = requests.get('{0}{1}'.format(url, endpoint))
    elif method == 'POST':
        r = requests.post('{0}{1}'.format(url, endpoint), json=body)
    # elif method == 'PUT':
    #     r = requests.put('{0}{1}'.format(url, endpoint), json=body)
    elif method == 'DELETE':
        r = requests.delete('{0}{1}'.format(url, endpoint), json=body)
    return json.loads(r.content)


def get_player():
    print('Which player?')
    players = request('GET', '/players/list')
    for i in range(len(players)):
        print('({0}) {1}'.format(i + 1, players[i]['name']))
    index = input()

    if index == "":
        return None

    try:
        return players[int(index) - 1]['name']
    except Exception:
        print("Invalid choice!")
        return get_player()


def match_property():
    keyword = input("Which property? ")
    if keyword == "exit":
        return None
    properties = request('GET', '/properties/list')
    possible_matches = []
    for property_ in properties:
        if property_['propName'].lower().find(keyword.lower()) != -1:
            possible_matches.append(property_['propName'])

    if len(possible_matches) == 0:
        print("No results found! Try again or type exit to quit.")
        return match_property()

    for i in range(len(possible_matches)):
        print('({0}) {1}'.format(i + 1, possible_matches[i]))

    index = input()
    if index == "exit":
        return None
    if index == "" and len(possible_matches) == 1:
        return possible_matches[0]
    if index == "" or int(index) <= 0 or int(index) > len(possible_matches):
        return match_property()

    return possible_matches[int(index) - 1]


def add_players(num_players=0):
    print('Keep inputting player names, enter a newline to exit...')
    name = input()

    while name != '':
        request('POST', '/players/add', {'name': name})
        name = input()
    num_players = len(request('GET', '/players/list'))
    if num_players < 2:
        print('Game must have at least 2 players!')
        add_players(num_players)


reset = input('Do you want to reset the game? (Y/n) ')
if reset == 'Y' or reset == 'y':
    request('GET', '/reset')

add_players()

while True:
    print('-' * 50)
    command = input('\nEnter a command: ')

    if command == 'buy':
        property_ = match_property()
        if property_ is None:
            continue

        player = get_player()
        if player is None:
            continue

        result = request('POST', '/players/buy_property', {'propertyName': property_, 'name': player})
        if result is False:
            print("Property is already owned!")

    elif command == 'trade':
        pass

    elif command == 'rent':
        pass

    elif command == 'house':
        pass

    elif command == 'go':
        player = get_player()
        request('POST', '/players/cross_go', {'name': player})
