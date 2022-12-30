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


def get_player(landed=False):
    print('Which player?') if landed is False else print('Which player has landed on the property?')
    players = request('GET', '/players')
    for i in range(len(players)):
        print('({0}) {1}'.format(i + 1, players[i]['name']))
    index = input()

    if index == '' or index == 'no' or index == 'none':
        return None

    try:
        return players[int(index) - 1]['name']
    except Exception:
        print('Invalid choice!')
        return get_player(landed)


def match_property(owned=False, buying=False):
    keyword = input('Which property? ')
    if keyword == 'exit' or keyword == 'no' or keyword == 'none':
        return None
    properties = request('GET', '/properties' + ('/owned' if owned is True else ('/unowned' if buying is True else '')))
    possible_matches = []
    for property_ in properties:
        if property_['propName'].lower().find(keyword.lower()) != -1:
            possible_matches.append(property_['propName'])

    if len(possible_matches) == 0:
        print('No results found! Try again or type exit to quit.')
        return match_property(owned, buying)

    for i in range(len(possible_matches)):
        print('({0}) {1}'.format(i + 1, possible_matches[i]))

    index = input()
    if index == 'exit' or index == 'no' or index == 'none':
        return None
    if index == '' and len(possible_matches) == 1:
        return possible_matches[0]
    try:
        if index == '' or int(index) <= 0 or int(index) > len(possible_matches):
            return match_property(owned, buying)
    except Exception:
        return match_property(owned, buying)

    return possible_matches[int(index) - 1]


def add_players(num_players=0):
    print('Keep inputting player names, enter a newline to exit...')
    name = input()

    while name != '':
        request('POST', '/players/add', {'name': name})
        name = input()
    num_players = len(request('GET', '/players'))
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
        property_ = match_property(buying=True)
        if property_ is None:
            continue

        player = get_player()
        if player is None:
            continue

        result = request('POST', '/players/buy_property', {'propertyName': property_, 'name': player})
        if result is False:
            print('Property is already owned!')

    elif command == 'trade':
        player1_properties = []
        player2_properties = []

        print('\nPlayer 1:')
        stop = False
        while stop is False:
            property_ = match_property(owned=True)
            if property_ is None:
                stop = True
            else:
                player1_properties.append(property_)
        player1_name = request('GET', '/properties/{0}'.format(player1_properties[0]))['playerName']
        print('{0} is trading: {1}'.format(player1_name, player1_properties))

        print('\nPlayer 2:')
        stop = False
        while stop is False:
            property_ = match_property(owned=True)
            if property_ is None:
                stop = True
            else:
                player2_properties.append(property_)

        player2_name = None
        if len(player2_properties) == 0:
            player2_name = get_player()
            if player2_name is None:
                continue

        else:
            player2_name = request('GET', '/properties/{0}'.format(player2_properties[0]))['playerName']

        print('{0} is trading: {1}'.format(player2_name, player2_properties))

        if player1_name == player2_name:
            print('Cannot trade between the same person!')
            continue

        try:
            amount = int(input('How much money is {0} receiving from {1}? '.format(player1_name, player2_name)))
        except Exception:
            print('Invalid amount!')

        request('POST', '/trade', {'player1Properties': player1_properties, 'player2Properties': player2_properties, 'player1Name': player1_name, 'player2Name': player2_name, 'amount': amount})

    elif command == 'rent':
        property_ = match_property(owned=True)
        roll = None
        if property_ is None:
            continue
        if 'Service' in property_:
            try:
                roll = int(input('What was the dice roll? '))
            except Exception:
                print('Not a valid value!')

        if 'Airport' in property_:
            roll = 0

        player = get_player(landed=True)
        if player is None:
            continue

        result = request('POST', '/players/{0}/pay_rent'.format(player), {'propertyName': property_, 'diceRoll': roll})
        if result is False:
            print('Cannot pay rent to the same person!')

    elif command == 'house':
        property_ = match_property(owned=True)
        if property_ is None:
            continue
        num_houses = request('GET', '/properties/' + property_)['numHouses']

        try:
            new_houses = int(input('How many houses should be added? (current: {0}) '.format(num_houses)))
        except Exception:
            print('Invalid input!')
            continue

        if int(num_houses) + new_houses > 5:
            print('Cannot have more than 5 houses!')
            continue

        request('POST', '/properties/' + property_ + '/houses', {'numHouses': new_houses})

    elif command == 'go':
        player = get_player()
        if player is not None:
            request('POST', '/players/cross_go', {'name': player})

    elif command == 'add':
        player = get_player()
        if player is None:
            continue
        try:
            amount = int(input('What is the amount? '))
        except Exception:
            print('Invalid input!')
            continue
        response = request('POST', '/players/add_money', {'name': player, 'amount': amount})
        if response is False:
            print('Error')

    elif command == 'mortgage':
        property_ = match_property(owned=True)
        request('POST', '/properties/{0}/mortgage'.format(property_))

    elif command == 'help' or command == 'h':
        print('\nAvailable Commands:\nbuy \t--- buy a new property \ntrade \t--- make a trade between two players \nrent \t--- calculate rent \nhouse \t--- buy or sell houses \nadd \t--- adjust money of player \ngo \t--- cross go')
